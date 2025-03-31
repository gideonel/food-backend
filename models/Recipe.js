import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  ingredients: [{ type: String, required: true }],
  costNaira: { type: Number, required: true },
  image: { type: String, default: '/images/test.jpg' }, // Default to local image
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
export default Recipe;
