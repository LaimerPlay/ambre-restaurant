import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '15mb' }));
app.use(cors());

// Подключение к MongoDB
await mongoose.connect('mongodb://localhost:27017/ambre_restaurantdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log('✅ Подключено к MongoDB');

// Роуты
import dishRoutes from './routes/dishes';
import orderRoutes from './routes/orders';

app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});