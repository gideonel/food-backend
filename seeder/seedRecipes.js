 import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from '../models/Recipe.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Generate 50 dummy recipes
const dummyRecipes = Array.from({ length: 50 }).map((_, i) => ({
  name: `Recipe ${i + 1}`,
  calories: Math.floor(Math.random() * 500) + 100, // Random calories between 100-600
  ingredients: [
    'Ingredient A',
    'Ingredient B',
    `Special Ingredient ${i + 1}`,
  ],
  costNaira: Math.floor(Math.random() * 5000) + 500, // Random price between 500-5500 NGN
}));

// Insert into database
const seedDatabase = async () => {
  try {
    await Recipe.deleteMany(); // Optional: Clears existing recipes
    await Recipe.insertMany(dummyRecipes);
    console.log('✅ Successfully added 50 dummy recipes!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();


// node seeder/seedRecipes.js