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

async function addExtendedSettings() {
  const client = await pool.connect();

  try {
    console.log('Adding extended settings...');

    const extendedSettings = [
      // Header Settings
      { key: 'header_background', value: '#ffffff', category: 'header', description: 'Header Hintergrundfarbe' },
      { key: 'header_text_color', value: '#333333', category: 'header', description: 'Header Textfarbe' },
      { key: 'header_height', value: '70', category: 'header', description: 'Header Höhe (px)' },
      { key: 'header_logo_text', value: 'Base', category: 'header', description: 'Logo Text' },

      // Footer Settings
      { key: 'footer_background', value: '#2c3e50', category: 'footer', description: 'Footer Hintergrundfarbe' },
      { key: 'footer_text_color', value: '#ecf0f1', category: 'footer', description: 'Footer Textfarbe' },
      { key: 'footer_height', value: 'auto', category: 'footer', description: 'Footer Höhe' },

      // Button Design
      { key: 'button_radius', value: '4', category: 'design', description: 'Button Border Radius (px)' },
      { key: 'button_padding', value: '10px 20px', category: 'design', description: 'Button Padding' },

      // Card/Container Design
      { key: 'card_radius', value: '8', category: 'design', description: 'Card Border Radius (px)' },
      { key: 'card_shadow', value: '0 2px 4px rgba(0,0,0,0.1)', category: 'design', description: 'Card Shadow' },

      // Spacing
      { key: 'spacing_unit', value: '8', category: 'design', description: 'Basis Spacing Unit (px)' },
      { key: 'container_max_width', value: '1200', category: 'design', description: 'Container Max Width (px)' },

      // Typography extended
      { key: 'line_height', value: '1.6', category: 'typography', description: 'Line Height' },
      { key: 'heading_weight', value: '600', category: 'typography', description: 'Heading Font Weight' },
      { key: 'body_weight', value: '400', category: 'typography', description: 'Body Font Weight' },
    ];

    for (const setting of extendedSettings) {
      await client.query(
        `INSERT INTO settings (key, value, category, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (key) DO NOTHING`,
        [setting.key, setting.value, setting.category, setting.description]
      );
    }

    console.log('✓ Extended settings added successfully!');

  } catch (error) {
    console.error('Error adding extended settings:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addExtendedSettings();
