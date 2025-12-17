import { Router } from 'express';
import { getAllPosts, getPostBySlug, createPost } from '../controllers/postsController.js';
import { authenticate, authorizeMinRole } from '../middleware/auth.js';

const router = Router();

// Public routes - anyone can read
router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);

// Protected routes - only authenticated users with at least 'user' role can create
router.post('/', authenticate, authorizeMinRole('user'), createPost);

export default router;
