import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [
        { username },
        { email },
        { phone }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Логин, email или телефон уже заняты' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, phone, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: 'Пользователь зарегистрирован' });
  } catch (err) {
    console.error('❌ Ошибка регистрации:', err.message);
    res.status(500).json({ message: 'Ошибка при регистрации' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  const { login, password } = req.body; // login = username / email / phone

  try {
    const user = await User.findOne({
      $or: [
        { username: login },
        { email: login },
        { phone: login }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    // Генерируем токен
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      'your_jwt_secret_key_here',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('❌ Ошибка входа:', err.message);
    res.status(500).json({ message: 'Ошибка при входе' });
  }
});

export default router;