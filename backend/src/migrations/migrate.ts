import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('Running database migrations...');

    const migrations = [
      '001_complete_schema.sql'
    ];

    for (const migration of migrations) {
      console.log(`Running migration: ${migration}`);
      const migrationSQL = readFileSync(
        join(__dirname, migration),
        'utf-8'
      );
      await client.query(migrationSQL);
      console.log(`✓ ${migration} completed`);
    }

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
