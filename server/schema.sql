CREATE DATABASE amazon_clone;

\c amazon_clone;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

INSERT INTO products (name, description, price, category, stock) VALUES
('Wireless Bluetooth Headphones', 'High quality wireless headphones with noise cancellation', 79.99, 'Electronics', 50),
('Smart Watch', 'Fitness tracker with heart rate monitor', 199.99, 'Electronics', 30),
('Running Shoes', 'Comfortable running shoes for men', 89.99, 'Sports', 100),
('Laptop Backpack', 'Water-resistant backpack for laptops up to 15 inches', 49.99, 'Accessories', 75),
('Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 'Electronics', 200),
('Yoga Mat', 'Non-slip yoga mat', 24.99, 'Sports', 150),
('Coffee Maker', 'Automatic coffee maker with timer', 59.99, 'Home', 40),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 34.99, 'Home', 80);
