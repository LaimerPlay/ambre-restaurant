import React, { useState } from 'react';
import './AuthTabs.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthTabs({ closeModal }) {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="auth-tabs">
      <div className="tab-header">
        <button
          className={activeTab === 'login' ? 'active' : ''}
          onClick={() => setActiveTab('login')}
        >
          Вход
        </button>
        <button
          className={activeTab === 'register' ? 'active' : ''}
          onClick={() => setActiveTab('register')}
        >
          Регистрация
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'login' && <LoginForm onClose={closeModal} />}
        {activeTab === 'register' && <RegisterForm />}
      </div>
    </div>
  );
}

export default AuthTabs;