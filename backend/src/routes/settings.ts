import express from 'express';
import {
  getAllSettings,
  getSettingsByCategory,
  getSetting,
  updateSetting,
  updateMultipleSettings,
  createSetting,
  deleteSetting
} from '../controllers/settingsController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes (alle können Settings lesen)
router.get('/', getAllSettings);
router.get('/category/:category', getSettingsByCategory);
router.get('/:key', getSetting);

// Admin-only routes
router.put('/bulk', authenticateToken, requireAdmin, updateMultipleSettings);
router.put('/:key', authenticateToken, requireAdmin, updateSetting);
router.post('/', authenticateToken, requireAdmin, createSetting);
router.delete('/:key', authenticateToken, requireAdmin, deleteSetting);

export default router;
