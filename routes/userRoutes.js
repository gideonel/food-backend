import express from 'express';
import { getUserProfile, getUserById } from '../controllers/userController.js';
import authMiddleware from '../routes/middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.get('/:userId', getUserById);

export default router;
