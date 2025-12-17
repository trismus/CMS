import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import {
  requestEmailVerification,
  verifyEmail,
  requestPasswordReset,
  resetPassword
} from '../controllers/emailController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Email verification
router.post('/request-verification', requestEmailVerification);
router.post('/verify-email', verifyEmail);

// Password reset
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router;
