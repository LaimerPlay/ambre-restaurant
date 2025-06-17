import React, { useState, useEffect } from 'react';
import './Menu.css';

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    tags: [],
  });

  const [selectedDish, setSelectedDish] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Все категории и теги
  const categories = ['Завтраки', 'Основные блюда', 'Десерты', 'Напитки', 'Особые блюда'];
  const allTags = {
    Завтраки: ['Горячее', 'Холодное', 'Вегетарианское', 'Антиаллергенное'],
    'Основные блюда': ['Горячее', 'Мясное', 'Рыбное', 'Подходит к вину'],
    Десерты: ['Холодное', 'С шоколадом', 'Фруктовое', 'Низкокалорийное'],
    Напитки: ['Горячее', 'Холодное', 'С кофеином', 'Без алкоголя'],
    'Особые блюда': ['Без глютена', 'Вегетарианское', 'Экологичное', 'Сезонное'],
  };

  // Загрузка блюд
  useEffect(() => {
    fetch('http://localhost:5000/api/dishes')
      .then(res => res.json())
      .then(data => setDishes(data))
      .catch(err => console.error('Ошибка загрузки блюд:', err));
  }, []);

  // Фильтрация
  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = filters.category === '' || dish.mainCategory === filters.category;
    const matchesTags = filters.tags.length === 0 || filters.tags.every(tag => dish.tags?.includes(tag));
    return matchesCategory && matchesTags;
  });

  // Обработчики
  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category,
      tags: []
    }));
  };

  const handleTagChange = (tag) => {
    setFilters(prev => {
      const updatedTags = [...prev.tags];
      if (updatedTags.includes(tag)) {
        updatedTags.splice(updatedTags.indexOf(tag), 1);
      } else {
        updatedTags.push(tag);
      }
      return { ...prev, tags: updatedTags };
    });
  };

  const openModal = (dish) => {
    setSelectedDish(dish);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedDish(null);
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item._id === selectedDish._id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({ ...selectedDish, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity} x ${selectedDish.name} добавлено в корзину`);
    closeModal();
  };

  return (
    <div className="menu">
      <div className="menu-header">
        <h1>Меню ресторана Ambre</h1>
        <p>Изысканные блюда ручной работы, созданные с любовью к деталям</p>
      </div>

      {/* Фильтры */}
      <div className="filter-section">
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={filters.category === category ? 'active' : ''}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Теги */}
        {filters.category && (
          <div className="tag-buttons">
            {allTags[filters.category]?.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={filters.tags.includes(tag) ? 'tag active' : 'tag'}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Блюда */}
      <div className="dishes-grid">
        {filteredDishes.length > 0 ? (
          filteredDishes.map(dish => (
            <div key={dish._id} className="dish-card" onClick={() => openModal(dish)}>
              <img src={dish.image || 'https://via.placeholder.com/200x150?text=Нет+фото'} alt={dish.name} />
              <div className="dish-info">
                <h3 className="dish-name">{dish.name}</h3>
                <div className="price-weight">
                  <span className="weight">{dish.weight || '—'} г</span>
                  <span className="price">{dish.price} ₽</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">Нет подходящих блюд</p>
        )}
      </div>

      {/* Модальное окно */}
      {selectedDish && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-body">
              <img
                src={selectedDish.image || 'https://via.placeholder.com/400x250?text=Нет+фото'}
                alt={selectedDish.name}
              />
              <div className="modal-details">
                <h2 className="dish-name">{selectedDish.name}</h2>
                <p className="description">{selectedDish.description || 'Описание отсутствует.'}</p>

                <div className="info-row">
                  <span>Вес: <strong>{selectedDish.weight || '—'} г</strong></span>
                  <span>Цена: <strong>{selectedDish.price} ₽</strong></span>
                </div>

                <div className="tags">
                  {selectedDish.tags?.map((tag, idx) => (
                    <span key={idx} className="tag-chip">{tag}</span>
                  ))}
                </div>

                <div className="quantity-control">
                  <label>Количество:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setQuantity(isNaN(val) || val < 1 ? 1 : val);
                    }}
                  />
                </div>

                <button className="add-to-cart-btn" onClick={addToCart}>
                  Добавить в корзину
                </button>
              </div>
            </div>
          </div>
        </div> // <== Эта строка закрывает модальное окно правильно
      )}
    </div>
  );
};

export default Menu;
