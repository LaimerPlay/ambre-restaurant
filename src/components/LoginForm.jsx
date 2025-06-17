import React, { useState } from 'react';
import './LoginForm.css';

function LoginForm({ closeModal }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка авторизации');
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('role', data.user.role);
      alert('Вы успешно вошли!');
      window.location.reload();
      closeModal();
    } catch (err) {
      console.error('Ошибка входа:', err.message);
      setMessage(err.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h2>Вход</h2>

      <input
        type="text"
        placeholder="Имя / Email / Телефон"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <label>
        <input type="checkbox" />
        Запомнить меня
      </label>

      <button type="submit" className="submit-button">
        Войти
      </button>

      {message && <p className="error-message">{message}</p>}
    </form>
  );
}

export default LoginForm;