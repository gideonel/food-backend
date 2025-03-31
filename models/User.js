import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: 'https://via.placeholder.com/150' },
  password: { type: String, required: true },
  image: { type: String, default: '/images/user.jpg' }, // Default to local image
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema); 