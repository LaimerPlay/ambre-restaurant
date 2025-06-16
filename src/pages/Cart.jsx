import React, { useState } from 'react';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [customAddress, setCustomAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');

  // Адреса самовывоза
  const pickupAddresses = [
    'ул. Пушкина, д. 10',
    'пр. Ленина, д. 45',
    'ул. Гоголя, д. 12'
  ];

  // Общая сумма
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCost = deliveryType === 'delivery' ? 200 : 0;
  const total = subtotal + deliveryCost;

  // Отправка заказа
  const handleCheckout = async () => {
    const orderData = {
      userName,
      userPhone,
      userEmail,
      deliveryType,
      address: deliveryType === 'delivery' ? customAddress : '',
      pickupAddress: deliveryType === 'pickup' ? selectedAddress : '',
      paymentMethod: 'online',
      items: cartItems.map(item => ({
        dishId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        weight: item.weight
      })),
      totalPrice: total,
      status: 'новый'
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Не удалось отправить заказ');

      alert('Заказ оформлен!');
      localStorage.setItem('cart', '[]');
      setCartItems([]);
    } catch (err) {
      console.error('❌ Ошибка оформления:', err.message);
      alert('Ошибка при оформлении заказа');
    }
  };

  return (
    <div className="cart">
      <h2>Корзина</h2>

      <div className="cart-layout">
        {/* Левый столбец: товары */}
        <div className="cart-items">
          {cartItems.length > 0 ? (
            cartItems.map(dish => (
              <div key={dish._id} className="cart-item">
                <img src={dish.image} alt={dish.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{dish.name}</h3>
                  <p><strong>Вес:</strong> {dish.weight || 'Не указан'} г</p>
                  <p><strong>Цена:</strong> {dish.price} ₽</p>
                </div>
                <div className="quantity-control">
                  <button onClick={() => console.log('Уменьшить')}>-</button>
                  <span>{dish.quantity}</span>
                  <button onClick={() => console.log('Увеличить')}>+</button>
                </div>
              </div>
            ))
          ) : (
            <p>Корзина пуста</p>
          )}
        </div>

        {/* Правый столбец: детали заказа */}
        <div className="order-summary">
          <h3>Оформление заказа</h3>

          <label>
            Имя:
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </label>

          <label>
            Телефон:
            <input type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
          </label>

          <label>
            Email:
            <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
          </label>

          <div className="delivery-toggle">
            <button
              className={`toggle-btn ${deliveryType === 'pickup' ? 'active' : ''}`}
              onClick={() => setDeliveryType('pickup')}
            >
              Самовывоз
            </button>
            <button
              className={`toggle-btn ${deliveryType === 'delivery' ? 'active' : ''}`}
              onClick={() => setDeliveryType('delivery')}
            >
              Доставка
            </button>
          </div>

          {/* Форма адреса */}
          {deliveryType === 'delivery' && (
            <div className="address-input">
              <label>Введите адрес доставки:</label>
              <input
                type="text"
                placeholder="Например: ул. Мира, д. 12, кв. 5"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
              />
            </div>
          )}

          {deliveryType === 'pickup' && (
            <div className="pickup-addresses">
              <p>Выберите точку самовывоза:</p>
              {pickupAddresses.map((address, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name="pickup"
                    checked={selectedAddress === address}
                    onChange={() => setSelectedAddress(address)}
                  />
                  {address}
                </label>
              ))}
            </div>
          )}

          {/* Сумма */}
          <div className="summary-details">
            <div className="detail-row">
              <span>Сумма:</span>
              <span>{subtotal} ₽</span>
            </div>
            <div className="detail-row">
              <span>Доставка:</span>
              <span>{deliveryCost} ₽</span>
            </div>
            <div className="total-row">
              <span>Итого:</span>
              <span>{total} ₽</span>
            </div>
          </div>

          {/* Кнопка оформления заказа */}
          <button className="checkout-btn" onClick={handleCheckout}>
            Оформить заказ <span>{total} ₽</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;