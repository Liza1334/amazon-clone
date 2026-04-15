import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config({ path: "../.env" });


const { Pool } = pg;


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});



const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronic devices' },
  { name: 'Clothing', slug: 'clothing', description: 'Fashionable apparel for men and women' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Furniture, decor, and kitchen essentials' },
  { name: 'Books', slug: 'books', description: 'Books, eBooks, and audiobooks' },
  { name: 'Sports', slug: 'sports', description: 'Sports equipment and fitness gear' },
  { name: 'Beauty', slug: 'beauty', description: 'Skincare, makeup, and personal care products' }
];

const products = [
  { name: 'Wireless Bluetooth Headphones', slug: 'wireless-bluetooth-headphones', description: 'Premium noise-cancelling headphones with 30-hour battery life', price: 2999, stock: 50, rating: 4.5, category_id: 1, specs: { color: 'Black', connectivity: 'Bluetooth 5.0', battery: '30 hours' }, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { name: 'Smart Watch Pro', slug: 'smart-watch-pro', description: 'Advanced smartwatch with health monitoring and GPS', price: 8999, stock: 30, rating: 4.7, category_id: 1, specs: { display: 'AMOLED', water_resistance: '5ATM', battery: '7 days' }, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  { name: 'Portable Bluetooth Speaker', slug: 'portable-bluetooth-speaker', description: 'Waterproof portable speaker with 360-degree sound', price: 1999, stock: 75, rating: 4.3, category_id: 1, specs: { waterproof: 'IPX7', battery: '12 hours', range: '30m' }, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
  { name: '4K Ultra HD Webcam', slug: '4k-ultra-hd-webcam', description: 'High-definition webcam for streaming and video calls', price: 5499, stock: 25, rating: 4.6, category_id: 1, specs: { resolution: '4K', fps: '30fps', autofocus: 'Yes' }, image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400' },
  { name: 'Wireless Charging Pad', slug: 'wireless-charging-pad', description: 'Fast wireless charging for all Qi-enabled devices', price: 999, stock: 100, rating: 4.2, category_id: 1, specs: { output: '15W', compatibility: 'Qi-enabled', led: 'Yes' }, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400' },
  { name: 'Cotton Crew Neck T-Shirt', slug: 'cotton-crew-neck-tshirt', description: 'Premium cotton t-shirt for everyday comfort', price: 599, stock: 200, rating: 4.1, category_id: 2, specs: { material: '100% Cotton', fit: 'Regular', sleeve: 'Short' }, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
  { name: 'Slim Fit Jeans', slug: 'slim-fit-jeans', description: 'Classic slim fit jeans in dark wash', price: 1499, stock: 80, rating: 4.4, category_id: 2, specs: { material: 'Denim', fit: 'Slim', wash: 'Dark' }, image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400' },
  { name: 'Wool Blend Winter Jacket', slug: 'wool-blend-winter-jacket', description: 'Warm winter jacket with hood', price: 4999, stock: 40, rating: 4.6, category_id: 2, specs: { material: 'Wool Blend', warmth: 'High', pockets: '4' }, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400' },
  { name: 'Running Sneakers', slug: 'running-sneakers', description: 'Lightweight running shoes with cushioning', price: 3499, stock: 60, rating: 4.5, category_id: 2, specs: { sole: 'Rubber', closure: 'Lace', weight: '250g' }, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { name: 'Casual Button-Down Shirt', slug: 'casual-button-down-shirt', description: 'Versatile button-down shirt for work or play', price: 1199, stock: 90, rating: 4.3, category_id: 2, specs: { material: 'Cotton', fit: 'Regular', pattern: 'Solid' }, image: 'https://images.unsplash.com/photo-1596755094514-f963e05016d5?w=400' },
  { name: 'Ceramic Dining Table Set', slug: 'ceramic-dining-table-set', description: '6-piece ceramic dining set for modern homes', price: 15999, stock: 15, rating: 4.7, category_id: 3, specs: { pieces: 6, material: 'Ceramic', seats: 6 }, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400' },
  { name: 'Air Fryer Pro', slug: 'air-fryer-pro', description: 'Digital air fryer with 5.8L capacity', price: 7499, stock: 35, rating: 4.6, category_id: 3, specs: { capacity: '5.8L', power: '1700W', temp_range: '180-400F' }, image: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400' },
  { name: 'Smart LED Light Bulbs', slug: 'smart-led-light-bulbs', description: 'WiFi-enabled RGB smart bulbs (4-pack)', price: 1299, stock: 120, rating: 4.2, category_id: 3, specs: { watts: '9W', color: 'RGB', wifi: '2.4GHz' }, image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400' },
  { name: 'Memory Foam Pillow', slug: 'memory-foam-pillow', description: 'Ergonomic memory foam pillow for better sleep', price: 899, stock: 150, rating: 4.4, category_id: 3, specs: { material: 'Memory Foam', firmness: 'Medium', cover: 'Removable' }, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400' },
  { name: 'Stainless Steel Cookware Set', slug: 'stainless-steel-cookware-set', description: '10-piece stainless steel cookware set', price: 5999, stock: 25, rating: 4.5, category_id: 3, specs: { pieces: 10, material: 'Stainless Steel', induction: 'Yes' }, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
  { name: 'JavaScript: The Complete Guide', slug: 'javascript-the-complete-guide', description: 'Comprehensive guide to JavaScript programming', price: 899, stock: 100, rating: 4.8, category_id: 4, specs: { pages: 1100, format: 'Paperback', language: 'English' }, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' },
  { name: 'Atomic Habits', slug: 'atomic-habits', description: 'Build good habits and break bad ones', price: 399, stock: 200, rating: 4.9, category_id: 4, specs: { pages: 320, format: 'Paperback', genre: 'Self-Help' }, image: 'https://images.unsplash.com/photo-1512820790803-83ca734dc794?w=400' },
  { name: 'The Psychology of Money', slug: 'the-psychology-of-money', description: 'Timeless lessons on wealth and happiness', price: 499, stock: 150, rating: 4.7, category_id: 4, specs: { pages: 256, format: 'Hardcover', genre: 'Finance' }, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400' },
  { name: 'Clean Code', slug: 'clean-code', description: 'A handbook of agile software craftsmanship', price: 699, stock: 80, rating: 4.8, category_id: 4, specs: { pages: 464, format: 'Paperback', genre: 'Programming' }, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400' },
  { name: 'Python for Data Science', slug: 'python-for-data-science', description: 'Python fundamentals for data science', price: 799, stock: 90, rating: 4.6, category_id: 4, specs: { pages: 548, format: 'Paperback', level: 'Intermediate' }, image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8206?w=400' },
  { name: 'Adjustable Dumbbells Set', slug: 'adjustable-dumbbells-set', description: 'Adjustable dumbbells 5-25 lbs (pair)', price: 8999, stock: 20, rating: 4.7, category_id: 5, specs: { weight_range: '5-25 lbs', material: 'Steel', warranty: '2 years' }, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe34?w=400' },
  { name: 'Yoga Mat Premium', slug: 'yoga-mat-premium', description: 'Extra thick non-slip yoga mat', price: 1499, stock: 100, rating: 4.5, category_id: 5, specs: { thickness: '6mm', material: 'TPE', size: '72x24' }, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' },
  { name: 'Resistance Bands Set', slug: 'resistance-bands-set', description: '5-level resistance bands with handles', price: 899, stock: 150, rating: 4.4, category_id: 5, specs: { levels: 5, material: 'Natural Latex', carrying: 'Bag included' }, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400' },
  { name: 'Cricket Bat - Willow', slug: 'cricket-bat-willow', description: 'Professional Kashmir willow cricket bat', price: 2499, stock: 40, rating: 4.6, category_id: 5, specs: { material: 'Kashmir Willow', weight: '1.2 kg', grade: 'Grade 1' }, image: 'https://images.unsplash.com/photo-1531415074968-bc2dbb6f6e5e?w=400' },
  { name: 'Football - Official Size', slug: 'football-official-size', description: 'Professional size 5 football', price: 699, stock: 80, rating: 4.3, category_id: 5, specs: { size: 5, material: 'PU Leather', bladder: 'Butyl' }, image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400' },
  { name: 'Vitamin C Serum', slug: 'vitamin-c-serum', description: '20% Vitamin C serum for glowing skin', price: 849, stock: 100, rating: 4.5, category_id: 6, specs: { volume: '30ml', concentration: '20%', vegan: 'Cruelty-free' }, image: 'https://images.unsplash.com/photo-1620916566398-39f1147ab7ba?w=400' },
  { name: 'Hydrating Face Moisturizer', slug: 'hydrating-face-moisturizer', description: 'Daily hydrating moisturizer for all skin types', price: 599, stock: 120, rating: 4.4, category_id: 6, specs: { volume: '50ml', type: 'Daily', skin_type: 'All' }, image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400' },
  { name: 'Professional Makeup Brush Set', slug: 'professional-makeup-brush-set', description: '12-piece premium makeup brush set', price: 1299, stock: 60, rating: 4.6, category_id: 6, specs: { pieces: 12, material: 'Synthetic', case: 'Yes' }, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
  { name: 'Organic Shampoo', slug: 'organic-shampoo', description: 'Sulfate-free organic shampoo', price: 449, stock: 150, rating: 4.3, category_id: 6, specs: { volume: '250ml', type: 'Sulfate-free', ingredient: 'Organic' }, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400' },
  { name: 'Perfume - Rose Elegance', slug: 'perfume-rose-elegance', description: 'Long-lasting floral fragrance', price: 1899, stock: 50, rating: 4.7, category_id: 6, specs: { volume: '50ml', type: 'Eau de Parfum', scent: 'Floral' }, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400' }
];

async function seed() {
  try {
    const client = await pool.connect();
  
await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    is_admin BOOLEAN DEFAULT false
  );

  CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT,
    slug TEXT UNIQUE,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT,
    slug TEXT UNIQUE,
    description TEXT,
    price NUMERIC,
    stock INTEGER,
    rating NUMERIC,
    category_id INTEGER REFERENCES categories(id),
    specs JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    url TEXT,
    is_primary BOOLEAN DEFAULT false
  );
  CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  product_id INTEGER,
  quantity INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  total NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  price NUMERIC
);
`);


    console.log('Seeding database...');

    // Create default user (id=1)
    const hashedPassword = await bcrypt.hash('password123', 10);
    await client.query(`
      INSERT INTO users (id, name, email, password, is_admin)
      VALUES (1, 'Default User', 'user@example.com', $1, false)
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [hashedPassword]);
    console.log('Default user created');

    // Insert categories
    for (const category of categories) {
      await client.query(`
        INSERT INTO categories (name, slug, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      `, [category.name, category.slug, category.description]);
    }
    console.log(`${categories.length} categories seeded`);

    // Insert products and images
    for (const product of products) {
      const { image, ...productData } = product;
      await client.query(`
        INSERT INTO products (name, slug, description, price, stock, rating, category_id, specs)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price
      `, [productData.name, productData.slug, productData.description, productData.price, productData.stock, productData.rating, productData.category_id, JSON.stringify(productData.specs)]);

      // Get the product ID
      const result = await client.query('SELECT id FROM products WHERE slug = $1', [productData.slug]);
      const productId = result.rows[0].id;

      // Insert product image
      await client.query(`
        INSERT INTO product_images (product_id, url, is_primary)
        VALUES ($1, $2, true)
        ON CONFLICT DO NOTHING
      `, [productId, image]);
    }
    console.log(`${products.length} products seeded`);

    client.release();
    console.log('Database seeding completed!');

  } catch (error) {
    console.error('Error seeding database:', error);

  }
}

export default seed;