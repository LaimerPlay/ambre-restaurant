import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('❌ Ошибка получения пользователей:', err.message);
    res.status(500).json({ message: 'Не удалось получить пользователей' });
  }
});

// Получить пользователя по ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (err) {
    console.error('❌ Ошибка получения пользователя:', err.message);
    res.status(500).json({ message: 'Не удалось получить пользователя' });
  }
});

// Добавить нового пользователя
router.post('/add', express.json(), async (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!username || !email || !phone || !password) {
    return res.status(400).json({ message: 'Имя пользователя, email, телефон и пароль обязательны' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email или телефоном уже существует' });
    }

    const newUser = new User({
      username,
      email,
      phone,
      password,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('❌ Ошибка сохранения пользователя:', err.message);
    res.status(500).json({ message: 'Не удалось сохранить пользователя' });
  }
});

export default router;