import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from '../models/Restaurant.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const seedRestaurants = async () => {
  const dummyRestaurants = [
    { name: 'Mama’s Kitchen', address: '123 Main St', city: 'Lagos', state: 'Lagos', latitude: 6.5244, longitude: 3.3792, rating: 4.5 },
    { name: 'Spice Hub', address: '456 Oak St', city: 'Abuja', state: 'FCT', latitude: 9.0579, longitude: 7.4951, rating: 4.2 },
    { name: 'Taste Buds', address: '789 Pine St', city: 'Port Harcourt', state: 'Rivers', latitude: 4.8156, longitude: 7.0498, rating: 4.7 },
  ];

  try {
    await Restaurant.insertMany(dummyRestaurants);
    console.log('Dummy restaurants seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding failed:', error);
  }
};

seedRestaurants();
