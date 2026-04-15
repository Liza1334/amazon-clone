# Database Setup Guide

## Prerequisites

- PostgreSQL installed and running
- Node.js installed

## Setup Steps

### 1. Configure Environment

Copy the example environment file and update with your PostgreSQL credentials:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: amazon_clone)
- `DB_USER` - PostgreSQL user (default: postgres)
- `DB_PASSWORD` - PostgreSQL password

### 2. Create Database

If the database doesn't exist, create it:

```bash
psql -U postgres -c "CREATE DATABASE amazon_clone;"
```

### 3. Run Schema

Execute the SQL schema to create all tables:

```bash
psql -U postgres -d amazon_clone -f schema.sql
```

Or using Node.js:

```bash
node -e "
import pg from 'pg';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pg;
const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'amazon_clone',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
});
client.connect().then(() => {
  const sql = readFileSync('./schema.sql', 'utf8');
  client.query(sql).then(() => {
    console.log('Schema created successfully');
    client.end();
  });
});
"
```

### 4. Run Seed

Populate the database with sample data:

```bash
node seed.js
```

This will create:
- 1 default user (email: user@example.com, password: password123)
- 6 categories
- 30 products with images
- Product specs in JSONB format

## Troubleshooting

### Connection errors

- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

### Permission errors

Grant all privileges to the database user:

```bash
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE amazon_clone TO postgres;"
```

## Default User Credentials

After running seed, you can login with:
- Email: user@example.com
- Password: password123