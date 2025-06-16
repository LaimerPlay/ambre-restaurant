// server/routes/users.js

import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Получить пользователя по ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
        res.json(user);
    } catch (err) {
        console.error('❌ Ошибка загрузки пользователя:', err.message);
        res.status(500).json({ message: 'Не удалось загрузить данные пользователя' });
    }
});

export default router;