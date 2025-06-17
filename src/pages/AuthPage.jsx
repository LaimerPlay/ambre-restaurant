import React, { useState } from 'react';
import './AuthPage.css';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  const switchToLogin = () => setActiveTab('login');
  const switchToRegister = () => setActiveTab('register');

  return (
    <div className="auth-page">
      <h1>Добро пожаловать</h1>
      <p>Введите свои данные или зарегистрируйтесь</p>

      <div className="auth-tabs">
        <button onClick={switchToLogin} className={activeTab === 'login' ? 'tab active' : 'tab'}>
          Войти
        </button>
        <button onClick={switchToRegister} className={activeTab === 'register' ? 'tab active' : 'tab'}>
          Регистрация
        </button>
      </div>

      <div className="auth-form-container">
        {activeTab === 'login' && <LoginForm closeModal={() => null} />}
        {activeTab === 'register' && <RegisterForm closeModal={() => null} />}
      </div>
    </div>
  );
};

export default AuthPage;