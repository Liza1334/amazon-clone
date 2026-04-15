import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'amazon_clone',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
})

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})
