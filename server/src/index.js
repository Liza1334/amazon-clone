import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from './routes/productRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { errorHandler } from './middleware/errorMiddleware.js'
import seed from '../db/seed.js'
dotenv.config()





const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: { status: 'ok' },
    message: 'Server is running'
  })
})



app.get('/seed', async (req, res) => {
  try {
    await seed()
    res.send('Database seeded successfully')
  } catch (err) {
    console.error(err)
    res.status(500).send('Seeding failed')
  }
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})