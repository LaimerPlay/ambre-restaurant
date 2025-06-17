import mongoose from 'mongoose';

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: String },
  description: { type: String },
  mainCategory: { type: String, required: true },
  tags: [{ type: String }],
  image: { type: String }, // можно оставить как есть, если сохраняешь путь
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Dish', DishSchema);