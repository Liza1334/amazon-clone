import { pool } from '../config/db.js'

// ✅ CREATE ORDER
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.body.user_id || 1
    const { shipping_address } = req.body

    const cartItems = await pool.query(
      `SELECT c.product_id, c.quantity, p.price 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    )

    if (cartItems.rows.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Cart is empty'
      })
    }

    const totalAmount = cartItems.rows.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    )

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // ✅ FIX: total + status
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, total, status, created_at) 
         VALUES ($1, $2, 'pending', CURRENT_TIMESTAMP) RETURNING *`,
        [userId, totalAmount]
      )

      const orderId = orderResult.rows[0].id

      for (const item of cartItems.rows) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price) 
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.product_id, item.quantity, item.price]
        )
      }

      await client.query('DELETE FROM cart WHERE user_id = $1', [userId])

      await client.query('COMMIT')

      const fullOrder = await pool.query(
        `SELECT o.id, o.total, o.status, o.created_at,
                json_agg(json_build_object(
                  'product_id', oi.product_id,
                  'quantity', oi.quantity,
                  'unit_price', oi.price,
                  'name', p.name,
                  'image', (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1)
                )) as items
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         JOIN products p ON oi.product_id = p.id
         WHERE o.id = $1
         GROUP BY o.id`,
        [orderId]
      )

      res.status(201).json({
        success: true,
        data: fullOrder.rows[0],
        message: 'Order created successfully'
      })

    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }

  } catch (err) {
    console.error("ORDER ERROR:", err.message)
    next(err)
  }
}

// ✅ GET ORDERS
export const getOrders = async (req, res, next) => {
  try {
    const userId = req.query.user_id || 1

    const result = await pool.query(
      `SELECT o.id, o.total, o.status, o.created_at,
              json_agg(json_build_object(
                'product_id', oi.product_id,
                'quantity', oi.quantity,
                'unit_price', oi.price,
                'name', p.name
              )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    )

    res.json({
      success: true,
      data: result.rows,
      message: 'Orders retrieved successfully'
    })

  } catch (err) {
    next(err)
  }
}