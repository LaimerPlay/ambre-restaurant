import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Создать заказ
router.post('/add', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('❌ Ошибка создания заказа:', err.message);
    res.status(500).json({ message: 'Не удалось сохранить заказ' });
  }
});

// Получить все заказы
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error('❌ Ошибка загрузки заказов:', err.message);
    res.status(500).json({ message: 'Не удалось загрузить заказы' });
  }
});

// Обновить статус заказа
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error('❌ Ошибка обновления заказа:', err.message);
    res.status(500).json({ message: 'Не удалось обновить заказ' });
  }
});

export default router;