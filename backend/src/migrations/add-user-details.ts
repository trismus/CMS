import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'meincms',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function addUserDetails() {
  const client = await pool.connect();

  try {
    console.log('Adding user detail fields to users table...');

    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS street VARCHAR(255),
      ADD COLUMN IF NOT EXISTS house_number VARCHAR(20),
      ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10),
      ADD COLUMN IF NOT EXISTS city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
    `);

    console.log('✓ User detail fields added successfully!');
  } catch (error) {
    console.error('Error adding user detail fields:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addUserDetails();
