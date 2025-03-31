import express from 'express';
import { getUserProfile, getUserById, getUserByUsername, getAllUsers, toggleUserActivation } from '../controllers/userController.js';
import authMiddleware from '../routes/middleware/authMiddleware.js';

const router = express.Router();

// Route to get the logged-in user's profile
router.get('/profile', authMiddleware, getUserProfile);

router.get('/username/:username', getUserByUsername);

// Route to get a user by their unique ID
router.get('/:userId', getUserById);

// Route to activate or deactivate a user
router.patch('/user/:userId/activate', toggleUserActivation);

// Route to get all users
router.get('/users', getAllUsers);


export default router;
