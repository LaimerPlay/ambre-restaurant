import React, { useState, useEffect } from 'react';
import './index.css';
import Header from './components/Header';
import NavigationMenu from './components/NavigationMenu';
import Modal from './components/Modal';
import AuthTabs from './components/AuthTabs';

// Импортируем страницы
import Home from './pages/Home';
import Menu from './pages/Menu';
import Booking from './pages/Booking';
import Contacts from './pages/Contacts';
import Promotions from './pages/Promotions';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Cart from './pages/Cart';

// Импортируем маршруты
import { Routes, Route } from 'react-router-dom';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Загружаем пользователя при монтировании
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, []);

  const handleLoginSuccess = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      {/* Верхнее меню */}
      <Header openAuth={() => setIsModalOpen(true)} isAuth={!!currentUser} />

      {/* Нижнее меню */}
      <NavigationMenu isAdmin={currentUser?.role === 'admin'} />

      {/* Основной контент */}
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>

      {/* Модальное окно авторизации */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AuthTabs closeModal={handleLoginSuccess} />
      </Modal>
    </div>
  );
}

export default App;