import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats
} from '../controllers/adminController.js';
import { authenticate, authorize, authorizeMinRole } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication
router.use(authenticate);

// Dashboard stats - accessible by admin and operator
router.get('/stats', authorizeMinRole('operator'), getDashboardStats);

// User management - admin only
router.get('/users', authorize('admin'), getAllUsers);
router.get('/users/:id', authorize('admin'), getUserById);
router.post('/users', authorize('admin'), createUser);
router.put('/users/:id', authorize('admin'), updateUser);
router.delete('/users/:id', authorize('admin'), deleteUser);

export default router;
