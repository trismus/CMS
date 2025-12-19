import { Request, Response } from 'express';
import { query } from '../db.js';

// Get all settings
export const getAllSettings = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM settings ORDER BY category, key'
    );

    // Transform array to object for easier frontend access
    const settingsObject: Record<string, any> = {};
    result.rows.forEach(setting => {
      settingsObject[setting.key] = {
        value: setting.value,
        category: setting.category,
        description: setting.description,
      };
    });

    res.json({ settings: settingsObject, raw: result.rows });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Get settings by category
export const getSettingsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    const result = await query(
      'SELECT * FROM settings WHERE category = $1 ORDER BY key',
      [category]
    );

    res.json({ settings: result.rows });
  } catch (error) {
    console.error('Get settings by category error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Get single setting by key
export const getSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const result = await query(
      'SELECT * FROM settings WHERE key = $1',
      [key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ setting: result.rows[0] });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

// Update setting
export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }

    const result = await query(
      `UPDATE settings
       SET value = $1, updated_at = CURRENT_TIMESTAMP
       WHERE key = $2
       RETURNING *`,
      [value, key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({
      message: 'Setting updated successfully',
      setting: result.rows[0]
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

// Update multiple settings at once
export const updateMultipleSettings = async (req: Request, res: Response) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object is required' });
    }

    const updates = [];

    for (const [key, value] of Object.entries(settings)) {
      const result = await query(
        `UPDATE settings
         SET value = $1, updated_at = CURRENT_TIMESTAMP
         WHERE key = $2
         RETURNING *`,
        [value, key]
      );

      if (result.rows.length > 0) {
        updates.push(result.rows[0]);
      }
    }

    res.json({
      message: 'Settings updated successfully',
      updated: updates.length,
      settings: updates
    });
  } catch (error) {
    console.error('Update multiple settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

// Create new setting
export const createSetting = async (req: Request, res: Response) => {
  try {
    const { key, value, category, description } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key and value are required' });
    }

    const result = await query(
      `INSERT INTO settings (key, value, category, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [key, value, category || 'general', description || '']
    );

    res.status(201).json({
      message: 'Setting created successfully',
      setting: result.rows[0]
    });
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Setting with this key already exists' });
    }
    console.error('Create setting error:', error);
    res.status(500).json({ error: 'Failed to create setting' });
  }
};

// Delete setting
export const deleteSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const result = await query(
      'DELETE FROM settings WHERE key = $1 RETURNING *',
      [key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
};
