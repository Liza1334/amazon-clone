import { pool } from '../config/db.js'

// ✅ GET CART
export const getCart = async (req, res, next) => {
  try {
    const userId = req.query.user_id || 1

    const result = await pool.query(
      `SELECT c.id, c.quantity, c.product_id, 
              p.name, p.price, p.rating, p.slug,
              (SELECT url FROM product_images 
               WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    )

    res.json({
      success: true,
      data: result.rows,
      message: 'Cart retrieved successfully'
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
}

// ✅ ADD TO CART
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.body.user_id || 1
    const { product_id, quantity = 1 } = req.body

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      })
    }

    // check product exists
    const product = await pool.query(
      'SELECT id FROM products WHERE id = $1',
      [product_id]
    )

    if (product.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // check if already in cart
    const existingItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    )

    if (existingItem.rows.length > 0) {
      const result = await pool.query(
        `UPDATE cart 
         SET quantity = quantity + $1 
         WHERE user_id = $2 AND product_id = $3 
         RETURNING *`,
        [quantity, userId, product_id]
      )

      return res.json({
        success: true,
        data: result.rows[0],
        message: 'Cart item updated'
      })
    }

    // insert new item
    const result = await pool.query(
      `INSERT INTO cart (user_id, product_id, quantity) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, product_id, quantity]
    )

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Item added to cart'
    })
  } catch (err) {
    console.error("ADD TO CART ERROR:", err.message)
    next(err)
  }
}

// ✅ UPDATE CART
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.body.user_id || 1
    const { product_id, quantity } = req.body

    if (!product_id || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      })
    }

    const result = await pool.query(
      `UPDATE cart 
       SET quantity = $1 
       WHERE user_id = $2 AND product_id = $3 
       RETURNING *`,
      [quantity, userId, product_id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      })
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Cart item updated'
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
}

// ✅ REMOVE FROM CART
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.query.user_id || 1
    const { product_id } = req.params

    const result = await pool.query(
      `DELETE FROM cart 
       WHERE user_id = $1 AND product_id = $2 
       RETURNING *`,
      [userId, product_id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      })
    }

    res.json({
      success: true,
      message: 'Item removed from cart'
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
}