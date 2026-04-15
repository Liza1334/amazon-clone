import express from 'express'
import { body, validationResult } from 'express-validator'
import { register, login } from '../controllers/authController.js'

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

router.post('/register', 
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validate,
  register
)

router.post('/login', 
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
  login
)

export default router