import React, { useState } from 'react';
import './RegisterForm.css';

function RegisterForm({ closeModal }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Не удалось зарегистрироваться');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('role', data.user.role);
      setMessage('Регистрация успешна!');
      setTimeout(() => {
        closeModal();
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('❌ Ошибка регистрации:', err.message);
      setMessage('Произошла ошибка при регистрации');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegistration}>
      <h2>Регистрация</h2>

      <input
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Подтвердите пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <label>
        <input type="checkbox" required />
        Я даю согласие на обработку персональных данных
      </label>

      <button type="submit" className="submit-button">
        Зарегистрироваться
      </button>

      {message && <p className="error-message">{message}</p>}
    </form>
  );
}

export default RegisterForm;