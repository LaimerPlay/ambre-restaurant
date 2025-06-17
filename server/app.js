// server/app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import dishesRoutes from './routes/dishes.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Подключение маршрутов
app.use('/api/dishes', dishesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

// Подключение к БД
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB подключен'))
  .catch(err => console.error('Ошибка подключения:', err));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});