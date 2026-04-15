import { pool } from '../config/db.js'

export const getCart = async (req, res, next) => {
  try {
    const userId = req.query.user_id || 1
    
    const result = await pool.query(
      `SELECT ci.id, ci.quantity, ci.product_id, 
              p.name, p.price, p.rating, p.slug,
              (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [userId]
    )
    
    res.json({
      success: true,
      data: result.rows,
      message: 'Cart retrieved successfully'
    })
  } catch (err) {
    next(err)
  }
}

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.body.user_id || 1
    const { product_id, quantity = 1 } = req.body
    
    if (!product_id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Product ID is required'
      })
    }
    
    const product = await pool.query('SELECT id FROM products WHERE id = $1', [product_id])
    if (product.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Product not found'
      })
    }
    
    const existingItem = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    )
    
    if (existingItem.rows.length > 0) {
      const result = await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity, userId, product_id]
      )
      return res.json({
        success: true,
        data: result.rows[0],
        message: 'Cart item updated'
      })
    }
    
    const result = await pool.query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [userId, product_id, quantity]
    )
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Item added to cart'
    })
  } catch (err) {
    next(err)
  }
}

export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.body.user_id || 1
    const { product_id, quantity } = req.body
    
    if (!product_id || quantity === undefined) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Product ID and quantity are required'
      })
    }
    
    const result = await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, userId, product_id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Cart item not found'
      })
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Cart item updated'
    })
  } catch (err) {
    next(err)
  }
}

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.query.user_id || 1
    const { product_id } = req.params
    
    const result = await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, product_id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Cart item not found'
      })
    }
    
    res.json({
      success: true,
      data: null,
      message: 'Item removed from cart'
    })
  } catch (err) {
    next(err)
  }
}