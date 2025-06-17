import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.warn('❌ ID пользователя не найден');
        window.location.href = '/auth';
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить профиль');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error.message);
        alert('Не удалось загрузить профиль. Попробуйте войти снова.');
        window.location.href = '/auth';
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    alert('Вы вышли из аккаунта');
    window.location.href = '/auth';
  };

  if (loading) {
    return <p>Загрузка профиля...</p>;
  }

  return (
    <div className="profile">
      <h1>Профиль</h1>

      {user ? (
        <>
          <div className="profile-card">
            <p><strong>Имя:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Телефон:</strong> {user.phone}</p>
            <p><strong>Бонусные баллы:</strong> {user.bonusPoints || 0}</p>
            <p><strong>Роль:</strong> {user.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
          </div>

          {/* Переход в админку */}
          {user.role === 'admin' && (
            <button onClick={() => (window.location.href = '/admin')}>
              Перейти в админ-панель
            </button>
          )}

          <button onClick={handleLogout} className="logout-button">
            Выйти
          </button>
        </>
      ) : (
        <p>Не удалось загрузить профиль</p>
      )}
    </div>
  );
};

export default Profile;