import express from 'express';
import Dish from '../models/Dish.js';

const router = express.Router();

// Получить все блюда
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    console.error('❌ Ошибка получения блюд:', err.message);
    res.status(500).json({ message: 'Не удалось получить блюда' });
  }
});

// Добавить блюдо
router.post('/add', express.json(), async (req, res) => {
  const { name, price, weight, description, mainCategory, tags, image } = req.body;

  if (!name || !price || !mainCategory) {
    return res.status(400).json({ message: 'Имя, цена и категория обязательны' });
  }

  try {
    const newDish = new Dish({
      name,
      price: Number(price),
      weight,
      description,
      mainCategory,
      tags: Array.isArray(tags) ? tags : [],
      image: image || ''
    });

    const savedDish = await newDish.save();
    res.status(201).json(savedDish);
  } catch (err) {
    console.error('❌ Ошибка сохранения блюда:', err.message);
    res.status(500).json({ message: 'Не удалось сохранить блюдо' });
  }
});

// Обновить блюдо
router.put('/:id', express.json(), async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedDish = await Dish.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDish) {
      return res.status(404).json({ message: 'Блюдо не найдено' });
    }

    res.json(updatedDish);
  } catch (err) {
    console.error('❌ Ошибка обновления блюда:', err.message);
    res.status(500).json({ message: 'Не удалось обновить блюдо' });
  }
});

// Удалить блюдо
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDish = await Dish.findByIdAndDelete(id);

    if (!deletedDish) {
      return res.status(404).json({ message: 'Блюдо не найдено' });
    }

    res.json({ message: 'Блюдо удалено', deletedDish });
  } catch (err) {
    console.error('❌ Ошибка удаления блюда:', err.message);
    res.status(500).json({ message: 'Не удалось удалить блюдо' });
  }
});

export default router;