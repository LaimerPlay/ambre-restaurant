import mongoose from 'mongoose';

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: String },
  description: { type: String },
  image: { type: String },
  mainCategory: {
    type: String,
    required: true,
    enum: ['Завтраки', 'Основные блюда', 'Десерты', 'Напитки', 'Особенности'],
  },
  tags: { type: [String], default: [] },
});

export default mongoose.model('Dish', DishSchema);