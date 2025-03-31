import Recipe from '../models/Recipe.js';

// Get all recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
};

// Search recipes by name
export const searchRecipes = async (req, res) => {
  try {
    const { query } = req.query;
    const recipes = await Recipe.find({ name: { $regex: query, $options: 'i' } });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error searching recipes', error });
  }
};
