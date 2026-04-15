import { pool } from '../config/db.js'

// GET CART
export const getCart = async (req, res, next) => {
  try {
    const userId = req.query.user_id || 1
    
    const result = await pool.query(
      `SELECT c.id, c.quantity, c.product_id, 
              p.name, p.price, p.rating, p.slug,
              (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
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
    console.error("GET CART ERROR:", err.message)
    next(err)
  }
}

// ADD TO CART
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.body.user_id || 1
    const { product_id, quantity = 1 } = req.body

    const existingItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    )

    if (existingItem.rows.length > 0) {
      const result = await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity, userId, product_id]
      )
      return res.json({
        success: true,
        data: result.rows[0],
        message: 'Cart item updated'
      })
    }

    const result = await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
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

// UPDATE CART
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.body.user_id || 1
    const { product_id, quantity } = req.body

    const result = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, userId, product_id]
    )

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Cart updated'
    })
  } catch (err) {
    next(err)
  }
}

// REMOVE
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.query.user_id || 1
    const { product_id } = req.params

    await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    )

    res.json({
      success: true,
      data: null,
      message: 'Item removed'
    })
  } catch (err) {
    next(err)
  }
}