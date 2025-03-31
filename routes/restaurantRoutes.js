import express from 'express';
import { getRestaurants, searchRestaurants, getNearbyRestaurants } from '../controllers/restaurantController.js';

const router = express.Router();

router.get('/', getRestaurants);
router.get('/search', searchRestaurants);
router.get('/nearby', getNearbyRestaurants);


export default router;
