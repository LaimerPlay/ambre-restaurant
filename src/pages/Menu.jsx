import React, { useEffect, useState } from 'react';
import './Menu.css';

function Menu() {
  const [dishes, setDishes] = useState([]);
  const [filters, setFilters] = useState({
    breakfasts: [],
    mainDishes: [],
    desserts: [],
    drinks: [],
    special: []
  });

  // Для модального окна
  const [selectedDish, setSelectedDish] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Все возможные теги для фильтрации
  const availableTags = {
    breakfasts: ['Горячее', 'Холодное', 'Вегетарианское', 'Антиаллергенное'],
    mainDishes: ['Горячее', 'Мясное', 'Рыбное', 'Подходит к вину'],
    desserts: ['Холодное', 'С шоколадом', 'Фруктовое', 'Низкокалорийное'],
    drinks: ['Горячее', 'Холодное', 'С кофеином', 'Без алкоголя'],
    special: ['Без глютена', 'Вегетарианское', 'Экологичное', 'Сезонное']
  };

  // Получаем все блюда при загрузке
  useEffect(() => {
    fetch('http://localhost:5000/api/dishes')
      .then(res => res.json())
      .then(data => setDishes(data))
      .catch(err => console.error('Ошибка загрузки блюд:', err));
  }, []);

  // Фильтрация блюд по категории + тегам
  const getFilteredDishesByCategory = (categoryName) => {
    return dishes.filter(dish => {
      const matchesCategory = dish.mainCategory === categoryName;
      const selectedTags = filters[categoryName.toLowerCase()];
      if (!selectedTags || selectedTags.length === 0) return matchesCategory;

      return (
        matchesCategory &&
        selectedTags.every(tag => dish.tags?.includes(tag))
      );
    });
  };

  // Переключение тега
  const toggleTag = (category, tag) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(tag)
        ? prev[category].filter(t => t !== tag)
        : [...prev[category], tag]
    }));
  };

  // Список категорий меню
  const categories = [
    {
      id: 'breakfasts',
      title: 'Завтраки',
      tags: availableTags.breakfasts
    },
    {
      id: 'mainDishes',
      title: 'Основные блюда',
      tags: availableTags.mainDishes
    },
    {
      id: 'desserts',
      title: 'Десерты',
      tags: availableTags.desserts
    },
    {
      id: 'drinks',
      title: 'Напитки',
      tags: availableTags.drinks
    },
    {
      id: 'special',
      title: 'Особые блюда',
      tags: availableTags.special
    }
  ];

  // Добавление в корзину
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
    setSelectedDish(null);
  };

  return (
    <div className="menu-page">
      <h1>Меню ресторана</h1>

      {/* Каждая категория */}
      {categories.map(category => (
        <section key={category.id} className="category-section">
          <h2>{category.title}</h2>

          {/* Фильтр по тегам */}
          <div className="tag-filter">
            {category.tags.map(tag => (
              <button
                key={tag}
                type="button"
                className={`tag-button ${filters[category.id]?.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(category.id, tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Блюда этой категории */}
          <div className="dishes-grid">
            {getFilteredDishesByCategory(category.title).map(dish => (
              <div
                key={dish._id}
                className="dish-card"
                onClick={() => setSelectedDish(dish)}
              >
                <img src={dish.image} alt={dish.name} />
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                <p className="price">{dish.price} ₽</p>
              </div>
            ))}

            {getFilteredDishesByCategory(category.title).length === 0 && (
              <p className="no-results">Нет подходящих блюд</p>
            )}
          </div>
        </section>
      ))}

      {/* Модальное окно с полной информацией о блюде */}
{selectedDish && (
  <div className="modal-overlay" onClick={() => setSelectedDish(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={() => setSelectedDish(null)}>×</button>

      {/* Изображение */}
      <img src={selectedDish.image} alt={selectedDish.name} className="modal-image" />

      {/* Название */}
      <h2>{selectedDish.name}</h2>

      {/* Описание */}
      <p className="modal-description">{selectedDish.description || 'Нет описания'}</p>

      {/* Категория + Теги */}
      <div className="modal-category-tags">
        <span className="modal-category">{selectedDish.mainCategory}</span>
        {selectedDish.tags?.length > 0 && (
          <div className="modal-tags">
            {selectedDish.tags.map((tag, idx) => (
              <span key={idx} className="tag-chip">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Выбор количества */}
      <div className="quantity-control">
        <label>Количество:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </div>

      {/* Цена и вес */}
      <div className="modal-meta">
        <span className="modal-price">{selectedDish.price} ₽</span>
        <span className="modal-weight">Вес: {selectedDish.weight || 'Не указано'}</span>
      </div>

      {/* Кнопка добавления в корзину */}
      <button className="add-to-cart-btn" onClick={addToCart}>
        Добавить в корзину
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default Menu;