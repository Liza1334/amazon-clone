
import { pool } from '../config/db.js'

// ✅ GET ALL PRODUCTS
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      search,
      category_id,
      sort = 'created_at',
      order = 'DESC',
      limit = 50,
      offset = 0
    } = req.query

    let query = `
      SELECT p.*, 
             c.name as category_name,
             (SELECT url FROM product_images 
              WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `

    const params = []
    let paramIndex = 1

    // 🔍 Search filter
    if (search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    // 📂 Category filter
    if (category_id) {
      query += ` AND p.category_id = $${paramIndex}`
      params.push(category_id)
      paramIndex++
    }

    // 🔃 Sorting
    const validSorts = ['created_at', 'price', 'rating', 'name']
    let sortColumn = validSorts.includes(sort) ? sort : 'created_at'
    let sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    if (sort === 'price_desc') {
      sortColumn = 'price'
      sortOrder = 'DESC'
    }

    query += ` ORDER BY p.${sortColumn} ${sortOrder}`

    // ✅ FIXED Pagination (IMPORTANT)
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(Number(limit), Number(offset))
    paramIndex += 2

    const result = await pool.query(query, params)

    res.json({
      success: true,
      data: result.rows,
      message: 'Products retrieved successfully'
    })
  } catch (err) {
    next(err)
  }
}

// ✅ GET PRODUCT BY ID
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params

    const productResult = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    )

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Product not found'
      })
    }

    const imagesResult = await pool.query(
      'SELECT id, url, is_primary FROM product_images WHERE product_id = $1',
      [id]
    )

    res.json({
      success: true,
      data: {
        ...productResult.rows[0],
        images: imagesResult.rows
      },
      message: 'Product retrieved successfully'
    })
  } catch (err) {
    next(err)
  }
}

// ✅ CREATE PRODUCT
export const createProduct = async (req, res, next) => {
  try {
    const { name, slug, description, price, stock, rating, category_id, specs } = req.body

    const result = await pool.query(
      `INSERT INTO products 
       (name, slug, description, price, stock, rating, category_id, specs) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, slug, description, price, stock || 0, rating || 0, category_id, JSON.stringify(specs || {})]
    )

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Product created successfully'
    })
  } catch (err) {
    next(err)
  }
}

// ✅ UPDATE PRODUCT
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, slug, description, price, stock, rating, category_id, specs } = req.body

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, slug = $2, description = $3, price = $4, stock = $5, 
           rating = $6, category_id = $7, specs = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [name, slug, description, price, stock, rating, category_id, JSON.stringify(specs || {}), id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Product updated successfully'
    })
  } catch (err) {
    next(err)
  }
}

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      data: null,
      message: 'Product deleted successfully'
    })
  } catch (err) {
    next(err)
  }
}

