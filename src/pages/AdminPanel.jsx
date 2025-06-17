import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel() {
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedTags: [],
    selectedCategory: ''
  });

  // Состояние формы блюда
  const emptyDish = {
    _id: null,
    name: '',
    price: '',
    weight: '',
    description: '',
    mainCategory: '',
    tags: [],
    image: ''
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Не удалось обновить статус');

      const updatedOrder = await response.json();
      setOrders(orders.map(order =>
        order._id === orderId ? updatedOrder : order
      ));
      alert('Статус обновлён');
    } catch (err) {
      console.error('❌ Ошибка обновления статуса:', err.message);
      alert('Ошибка при обновлении статуса');
    }
  };

  const [form, setForm] = useState(emptyDish);

  // Все основные категории
  const categoryTags = ['Завтраки', 'Основные блюда', 'Десерты', 'Напитки', 'Особенности'];

  // Вспомогательные теги по категориям
  const availableTags = {
    Завтраки: ['Горячее', 'Холодное', 'Вегетарианское', 'Антиаллергенное'],
    'Основные блюда': ['Горячее', 'Мясное', 'Рыбное', 'Подходит к вину'],
    Десерты: ['Холодное', 'С шоколадом', 'Фруктовое', 'Низкокалорийное'],
    Напитки: ['Горячее', 'Холодное', 'С кофеином', 'Без алкоголя'],
    Особенности: ['Без глютена', 'Вегетарианское', 'Экологичное', 'Сезонное']
  };

  // Получаем список блюд
  useEffect(() => {
    if (activeTab === 'menu') {
      fetch('http://localhost:5000/api/dishes')
        .then(res => res.json())
        .then(data => setDishes(data))
        .catch(err => console.error('Ошибка загрузки блюд:', err));
    }

    if (activeTab === 'orders') {
      fetch('http://localhost:5000/api/orders')
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error('Ошибка загрузки заказов:', err));
    }
  }, [activeTab]);

  // Фильтрация блюд
  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = filters.searchTerm
      ? dish.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      : true;

    const matchesCategory = filters.selectedCategory
      ? dish.mainCategory === filters.selectedCategory
      : true;

    const selectedTags = filters.selectedTags;
    if (!selectedTags || selectedTags.length === 0) return matchesSearch && matchesCategory;

    return (
      matchesSearch &&
      matchesCategory &&
      selectedTags.every(tag => dish.tags?.includes(tag))
    );
  });

  // Обработчики для формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMainCategoryChange = (e) => {
    setForm({ ...form, mainCategory: e.target.value });
  };

  const handleAdditionalTagChange = (e) => {
    const tag = e.target.value;

    if (e.target.checked) {
      setForm({ ...form, tags: [...form.tags, tag] });
    } else {
      setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const maxSizeInBytes = 15 * 1024 * 1024; // 15 MB
  
    if (!file) return;
  
    if (file.size > maxSizeInBytes) {
      alert('Файл слишком большой! Максимальный размер — 15 МБ.');
      return;
    }
  
    setForm({ ...form, image: file }); // сохраняем объект File
  };

  const handleSave = async () => {
    const formData = new FormData();
  
    // Добавляем поля формы
    Object.keys(form).forEach(key => {
      if (key !== 'image') {
        formData.append(key, form[key]);
      }
    });
  
    // Добавляем изображение, если оно есть
    if (form.image instanceof File) {
      formData.append('image', form.image);
    }
  
    try {
      const method = form._id ? 'PUT' : 'POST';
      const url = form._id
        ? `http://localhost:5000/api/dishes/${form._id}`
        : 'http://localhost:5000/api/dishes/add';
  
      const response = await fetch(url, {
        method,
        body: formData
      });
  
      if (!response.ok) throw new Error('Не удалось сохранить блюдо');
  
      alert(form._id ? 'Обновлено!' : 'Добавлено!');
      setIsModalOpen(false);
      setForm({ ...emptyDish });
  
      const updatedDishes = await fetch('http://localhost:5000/api/dishes').then(res => res.json());
      setDishes(updatedDishes);
    } catch (err) {
      console.error('❌ Ошибка сохранения:', err.message);
      alert('Ошибка при сохранении блюда');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить это блюдо?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/dishes/${form._id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Не удалось удалить блюдо');

      alert('Блюдо удалено');
      setIsModalOpen(false);
      setForm({ ...emptyDish });

      const updatedDishes = await fetch('http://localhost:5000/api/dishes').then(res => res.json());
      setDishes(updatedDishes);
    } catch (err) {
      console.error('❌ Ошибка удаления:', err.message);
      alert('Ошибка при удалении блюда');
    }
  };

  const startEdit = (dish) => {
    setForm(dish || { ...emptyDish });
    setIsModalOpen(true);
  };

  return (
    <div className="admin-panel">
      <h2>Админ-панель</h2>

      {/* Вкладки */}
      <div className="admin-tabs">
        <button onClick={() => setActiveTab('menu')} className={activeTab === 'menu' ? 'active' : ''}>
          Меню
        </button>
        <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>
          Заказы
        </button>
      </div>

      {/* Вкладка: Меню */}
      {activeTab === 'menu' && (
        <div className="menu-section">
          {/* Блюда */}
<div className="dishes-grid">
  {filteredDishes.map(dish => (
    <div key={dish._id} className="dish-card" onClick={() => startEdit(dish)}>
      <div className="dish-image-container">
        <img
          src={dish.image || 'https://via.placeholder.com/200x150?text=Нет+фото'}
          alt={dish.name}
          className="dish-image"
        />
      </div>
      <h3>{dish.name}</h3>
      <p>{dish.price} ₽</p>
    </div>
  ))}

  <div className="dish-card empty" onClick={() => startEdit({ ...emptyDish })}>
    <div className="plus">+</div>
    <p>Добавить новое блюдо</p>
  </div>
</div>
        </div>
      )}

      {/* Вкладка: Заказы */}
      {activeTab === 'orders' && (
        <div className="orders-section">
          <h3>Список заказов</h3>

          {/* Фильтры */}
          <div className="order-filters">
            <input
              type="text"
              placeholder="Поиск по имени или ID"
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />

            <select
              value={filters.selectedCategory}
              onChange={(e) => setFilters({ ...filters, selectedCategory: e.target.value })}
            >
              <option value="">Все категории</option>
              {categoryTags.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Таблица заказов */}
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Пользователь</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Способ получения</th>
                <th>Адрес</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.userName}</td>
                    <td>{order.userPhone}</td>
                    <td>{order.userEmail}</td>
                    <td>{order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}</td>
                    <td>{order.address || order.pickupAddress || '-'}</td>
                    <td>{order.totalPrice} ₽</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="новый">Новый</option>
                        <option value="в обработке">В обработке</option>
                        <option value="готов">Готов</option>
                        <option value="доставляется">Доставляется</option>
                        <option value="завершён">Завершён</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="9">Нет заказов</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>

            <h2>{form._id ? 'Редактировать блюдо' : 'Добавить новое блюдо'}</h2>

            <div className="form-group">
              <label>Изображение:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <div className="image-preview">
                {form.image ? (
                  <img src={form.image} alt="Предпросмотр" />
                ) : (
                  <div className="placeholder">Нет изображения</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Название:</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Цена:</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Вес:</label>
              <input name="weight" value={form.weight} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Описание:</label>
              <textarea name="description" value={form.description} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Основная категория:</label>
              <select name="mainCategory" value={form.mainCategory} onChange={handleMainCategoryChange}>
                <option value="">-- Выберите категорию --</option>
                {categoryTags.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Дополнительные теги:</label>
              {availableTags[form.mainCategory]?.map(tag => (
                <label key={tag} className="tag-checkbox">
                  <input
                    type="checkbox"
                    value={tag}
                    checked={form.tags.includes(tag)}
                    onChange={handleAdditionalTagChange}
                  />
                  {tag}
                </label>
              ))}
            </div>

            <div className="button-group">
              {form._id && (
                <button type="button" className="delete-button" onClick={handleDelete}>
                  Удалить блюдо
                </button>
              )}
              <button className="save-button" onClick={handleSave}>
                {form._id ? 'Сохранить изменения' : 'Добавить блюдо'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;