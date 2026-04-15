import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '7d' }
  )
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'User already exists'
      })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    )
    
    const token = generateToken(result.rows[0].id)
    
    res.status(201).json({
      success: true,
      data: {
        token,
        user: result.rows[0]
      },
      message: 'Registration successful'
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid credentials'
      })
    }
    
    const user = result.rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid credentials'
      })
    }
    
    const token = generateToken(user.id)
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      message: 'Login successful'
    })
  } catch (err) {
    next(err)
  }
}