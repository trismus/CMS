import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'base',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function createSettings() {
  const client = await pool.connect();

  try {
    console.log('Creating settings table...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT,
        category VARCHAR(100),
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✓ Settings table created successfully!');

    // Insert default settings
    console.log('Inserting default settings...');

    const defaultSettings = [
      // Design Colors
      { key: 'primary_color', value: '#007bff', category: 'design', description: 'Primäre Farbe' },
      { key: 'secondary_color', value: '#6c757d', category: 'design', description: 'Sekundäre Farbe' },
      { key: 'accent_color', value: '#28a745', category: 'design', description: 'Akzentfarbe' },
      { key: 'background_color', value: '#ffffff', category: 'design', description: 'Hintergrundfarbe' },
      { key: 'text_color', value: '#333333', category: 'design', description: 'Textfarbe' },

      // Typography
      { key: 'font_family', value: 'Inter, system-ui, sans-serif', category: 'typography', description: 'Schriftart' },
      { key: 'font_size_base', value: '16', category: 'typography', description: 'Basis-Schriftgröße (px)' },
      { key: 'heading_font', value: 'Inter, system-ui, sans-serif', category: 'typography', description: 'Überschrift-Schriftart' },

      // Site Info
      { key: 'site_name', value: 'Base', category: 'general', description: 'Name der Website' },
      { key: 'site_tagline', value: 'Content Management System', category: 'general', description: 'Slogan' },
      { key: 'copyright_text', value: '© 2025 Base. Alle Rechte vorbehalten.', category: 'general', description: 'Copyright Text' },
      { key: 'footer_text', value: 'Entwickelt mit Claude Code', category: 'general', description: 'Footer Text' },

      // Contact
      { key: 'contact_email', value: 'info@base.local', category: 'contact', description: 'Kontakt E-Mail' },
      { key: 'support_email', value: 'support@base.local', category: 'contact', description: 'Support E-Mail' },
    ];

    for (const setting of defaultSettings) {
      await client.query(
        `INSERT INTO settings (key, value, category, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (key) DO NOTHING`,
        [setting.key, setting.value, setting.category, setting.description]
      );
    }

    console.log('✓ Default settings inserted successfully!');

  } catch (error) {
    console.error('Error creating settings:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createSettings();
