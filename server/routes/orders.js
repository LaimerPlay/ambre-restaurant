// server/routes/orders.js
import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Получить все заказы
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error('❌ Ошибка получения заказов:', err.message);
    res.status(500).json({ message: 'Не удалось получить заказы' });
  }
});

// Добавить заказ
router.post('/add', express.json(), async (req, res) => {
  const { user, dishes, total, status } = req.body;

  if (!user || !dishes || !total) {
    return res.status(400).json({ message: 'Пользователь, блюда и общая сумма обязательны' });
  }

  try {
    const newOrder = new Order({
      user,
      dishes,
      total,
      status: status || 'pending',
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('❌ Ошибка сохранения заказа:', err.message);
    res.status(500).json({ message: 'Не удалось сохранить заказ' });
  }
});

export default router;