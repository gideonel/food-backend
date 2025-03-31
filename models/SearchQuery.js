import mongoose from 'mongoose';

const searchQuerySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  query: { type: String, required: true },
  type: { type: String, enum: ['recipe', 'restaurant'], required: true },
}, { timestamps: true });

export default mongoose.model('SearchQuery', searchQuerySchema);
