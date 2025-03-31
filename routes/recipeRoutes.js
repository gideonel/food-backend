import express from 'express';
import { getRecipes, searchRecipes } from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getRecipes);
router.get('/search', searchRecipes);

export default router;
