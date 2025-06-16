import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai'; // Иконка поиска
import { BiUser, BiShoppingBag } from 'react-icons/bi'; // Иконки профиля и корзины
import { FaClock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; // Иконки информации
import './Header.css';

function Header({ openAuth, isAuth }) {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    if (inputValue.trim()) {
      window.location.href = `/menu?search=${encodeURIComponent(inputValue)}`;
    }
  };

  return (
    <header className="header">
      {/* Логотип */}
      <div className="logo">
        {/* Ресторанная иконка */}
        <div className="logo-icon">
          <img src="/images/logo.png" alt="Логотип Ambre" />
        </div>
        <span className="restaurant-name">Ambre</span>
      </div>

      {/* Поиск */}
      <div className="search">
        <input
          type="text"
          placeholder="Поиск по меню"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch}>
          <AiOutlineSearch size={24} color="#fff" />
        </button>
      </div>

      {/* Информация + кнопки */}
      <div className="info">
        {/* Время работы */}
        <div className="info-item">
          <FaClock size={24} color="var(--amber-color)" />
          <div className="info-text">
            <p>Время работы</p>
            <strong>9:00 - 24:00</strong>
          </div>
        </div>

        {/* Телефон */}
        <div className="info-item">
          <FaPhone size={24} color="var(--amber-color)" />
          <div className="info-text">
            <p>Телефон</p>
            <strong>+7-(953)-460-71-99</strong>
          </div>
        </div>

        {/* Адрес */}
        <div className="info-item">
          <FaMapMarkerAlt size={24} color="var(--amber-color)" />
          <div className="info-text">
            <p>Адрес</p>
            <strong>г. Калуга, ул. Театральная, д. 2</strong>
          </div>
        </div>

        {/* Корзина */}
        {isAuth && (
          <a href="/cart" className="icon-wrapper cart-button">
            <BiShoppingBag size={24} color="var(--amber-color)" />
          </a>
        )}

        {/* Профиль */}
        {isAuth ? (
          <a href="/profile" className="icon-wrapper user-icon">
            <BiUser size={24} color="var(--amber-color)" />
          </a>
        ) : (
          <div className="login-button" onClick={openAuth}>
            <BiUser size={24} color="#fff" /> Войти
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;