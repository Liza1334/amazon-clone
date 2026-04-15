# Amazon Clone

A full-stack e-commerce application inspired by Amazon, built with React and Node.js.

## Project Structure

```
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/          # Express.js backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   ├── schema.sql
│   └── package.json
│
├── package.json     # Root package.json
└── README.md
```

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- PostgreSQL (pg)
- bcrypt
- jsonwebtoken
- express-validator
- cors
- dotenv

## Prerequisites

- Node.js (v14+)
- PostgreSQL

## Setup

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Database Setup:**
   - Create PostgreSQL database: `createdb amazon_clone`
   - Run schema: `psql -d amazon_clone -f server/schema.sql`

3. **Configure Environment:**
   - Update `server/.env` with your PostgreSQL credentials

4. **Start Development:**
   ```bash
   npm run dev
   ```

   This starts both frontend (port 5173) and backend (port 5000).

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

## Features

- User authentication (register/login)
- Product listing with details
- Shopping cart functionality
- Responsive design with Tailwind CSS
- JWT-based authentication
