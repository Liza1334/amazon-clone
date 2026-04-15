import express from 'express'
import { body, param, validationResult } from 'express-validator'
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js'

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

router.get('/', getCart)

router.post('/',
  body('product_id').isInt({ min: 1 }),
  body('quantity').optional().isInt({ min: 1 }),
  validate,
  addToCart
)

router.put('/',
  body('product_id').isInt({ min: 1 }),
  body('quantity').isInt({ min: 0 }),
  validate,
  updateCartItem
)

router.delete('/:product_id',
  param('product_id').isInt({ min: 1 }),
  validate,
  removeFromCart
)

export default router