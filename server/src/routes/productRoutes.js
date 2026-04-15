import express from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'

const router = express.Router()

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: errors.array()[0].msg
    })
  }
  next()
}

router.get('/', 
  query('search').optional().isString(),
  query('category_id').optional().isInt(),
  query('sort').optional().isString(),
  query('order').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  validate,
  getAllProducts
)

router.get('/:id', 
  param('id').isInt({ min: 1 }),
  validate,
  getProductById
)

router.post('/',
  body('name').notEmpty().trim(),
  body('slug').notEmpty().trim(),
  body('description').optional().isString(),
  body('price').isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category_id').optional().isInt(),
  validate,
  createProduct
)

router.put('/:id',
  param('id').isInt({ min: 1 }),
  body('name').notEmpty().trim(),
  body('slug').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  validate,
  updateProduct
)

router.delete('/:id',
  param('id').isInt({ min: 1 }),
  validate,
  deleteProduct
)

export default router