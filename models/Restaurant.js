import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  image: { type: String, default: 'https://via.placeholder.com/150' },
});

export default mongoose.model('Restaurant', restaurantSchema);
