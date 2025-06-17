import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Страницы
import Home from './pages/Home';
import Menu from './pages/Menu';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import AuthPage from './pages/AuthPage'; // Модальное окно для входа/регистрации
import Contacts from './pages/Contacts';
import Promotions from './pages/Promotions';
import Booking from './pages/Booking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="*" element={<h1>Страница не найдена</h1>} />
      </Routes>
    </Router>
  );
}

export default App;