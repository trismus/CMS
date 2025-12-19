import bcrypt from 'bcrypt';
import pool from '../db.js';

async function seedUsers() {
  const client = await pool.connect();

  try {
    console.log('Seeding database with test users...');

    const saltRounds = 10;

    const testUsers = [
      {
        username: 'admin',
        email: 'admin@base.local',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'operator',
        email: 'operator@base.local',
        password: 'operator123',
        role: 'operator'
      },
      {
        username: 'user',
        email: 'user@base.local',
        password: 'user123',
        role: 'user'
      },
      {
        username: 'guest',
        email: 'guest@base.local',
        password: 'guest123',
        role: 'guest'
      }
    ];

    for (const user of testUsers) {
      // Check if user already exists
      const existing = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [user.email]
      );

      if (existing.rows.length > 0) {
        console.log(`✓ User ${user.username} (${user.role}) already exists, skipping...`);
        continue;
      }

      const passwordHash = await bcrypt.hash(user.password, saltRounds);

      await client.query(
        `INSERT INTO users (username, email, password_hash, role, is_active)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.username, user.email, passwordHash, user.role, true]
      );

      console.log(`✓ Created user: ${user.username} (${user.role})`);
    }

    console.log('\nTest users created successfully!');
    console.log('\nLogin credentials:');
    console.log('==================');
    testUsers.forEach(user => {
      console.log(`${user.role.toUpperCase().padEnd(10)} - Email: ${user.email.padEnd(30)} Password: ${user.password}`);
    });
    console.log('==================\n');

  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedUsers();
