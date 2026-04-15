import express from 'express'
import { body, validationResult } from 'express-validator'
import { createOrder, getOrders } from '../controllers/orderController.js'

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

router.post('/',
  body('shipping_address').optional().isString(),
  validate,
  createOrder
)

router.get('/', getOrders)

export default router