import React from 'react';
import { Link, useMatch } from 'react-router-dom';
import './NavigationMenu.css';

function NavigationMenu({ isAdmin }) {
  const routes = [
    { path: '/', label: 'Главная' },
    { path: '/menu', label: 'Меню' },
    { path: '/booking', label: 'Бронирование' },
    { path: '/promotions', label: 'Акции' },
    { path: '/bonuses', label: 'Бонусы' },
    { path: '/contacts', label: 'Контакты' },
  ];

  // ✅ Сначала используем useMatch для каждого элемента по отдельности
  const matchedRoutes = routes.map(item => {
    const match = useMatch(item.path);
    return { ...item, match };
  });

  // То же самое для админки
  const adminMatch = useMatch('/admin');
  const adminRoutes = isAdmin ? [{ path: '/admin', label: 'Управление', match: adminMatch }] : [];

  return (
    <nav className="navigation-menu">
      <ul>
        {matchedRoutes.map(({ path, label, match }) => (
          <li key={path}>
            <Link to={path} className={match ? 'active' : ''}>
              {label}
            </Link>
          </li>
        ))}

        {/* Админка */}
        {isAdmin &&
          adminRoutes.map(({ path, label, match }) => (
            <li key={path}>
              <Link to={path} className={match ? 'active' : ''}>
                {label}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}

// ✅ Экспортируем компонент как по умолчанию
export default NavigationMenu;