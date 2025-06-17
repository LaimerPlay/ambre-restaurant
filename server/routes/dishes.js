import express from 'express';
import Dish from '../models/Dish.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем __dirname в ESM модуле
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Папка для хранения изображений
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // оригинальное расширение
  }
});

const upload = multer({ storage: storage });

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

// Добавить новое блюдо
router.post('/add', upload.single('image'), async (req, res) => {
  const { name, price, weight, description, mainCategory, tags } = req.body;

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
      tags: Array.isArray(tags) ? JSON.parse(tags) : [],
      image: req.file ? `/uploads/${req.file.filename}` : '', // путь к изображению
    });

    const savedDish = await newDish.save();
    res.status(201).json(savedDish);
  } catch (err) {
    console.error('❌ Ошибка сохранения блюда:', err.message);
    res.status(500).json({ message: 'Не удалось сохранить блюдо' });
  }
});

// Обновить блюдо
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

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