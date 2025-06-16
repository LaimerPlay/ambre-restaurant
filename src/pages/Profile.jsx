import React, { useState, useEffect } from 'react';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userId = currentUser?.id;

        if (!userId) {
            alert('Вы не вошли в систему. Пожалуйста, войдите или зарегистрируйтесь.');
            return;
        }

        fetch(`http://localhost:5000/api/users/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error('Не удалось загрузить профиль');
                return res.json();
            })
            .then(data => setUser(data))
            .catch(err => {
                console.error('Ошибка загрузки профиля:', err);
                alert('Произошла ошибка при загрузке профиля. Попробуйте позже.');
            });
    }, []);

    if (!user) return <p>Загрузка...</p>;

    return (
        <div className="profile-page">
            <h2>Профиль</h2>
            <div className="profile-card">
                <p><strong>Имя:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Телефон:</strong> {user.phone}</p>
                <p><strong>Бонусные баллы:</strong> {user.bonusPoints}</p>
                <button onClick={() => alert('Перейти к истории заказов')}>История заказов</button>
            </div>
        </div>
    );
}

export default Profile;