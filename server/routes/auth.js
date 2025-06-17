import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    // Проверка на существующего пользователя
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

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём нового пользователя
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword
    });

    await newUser.save();

    // Генерируем токен
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'Пользователь зарегистрирован', user: { id: newUser._id, role: newUser.role }, token });
  } catch (err) {
    console.error('❌ Ошибка регистрации:', err.message);
    res.status(500).json({ message: 'Ошибка регистрации' });
  }
});

// Вход пользователя
router.post('/login', async (req, res) => {
  const { login, password } = req.body; // login — это username, email или phone

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

    // Генерация токена
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, role: user.role, username: user.username } });
  } catch (err) {
    console.error('❌ Ошибка входа:', err.message);
    res.status(500).json({ message: 'Ошибка при входе' });
  }
});

export default router;