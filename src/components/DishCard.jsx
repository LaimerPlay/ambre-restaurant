import React from 'react';
import { Link } from 'react-router-dom';
import './DishCard.css';

function DishCard({ dish }) {
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existing = cart.find(item => item.id === dish.id);
    if (existing) {
      const updated = cart.map(item =>
        item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem('cart', JSON.stringify(updated));
    } else {
      localStorage.setItem('cart', JSON.stringify([...cart, { ...dish, quantity: 1 }]));
    }

    alert(`${dish.name} добавлено в корзину`);
  };

  return (
    <div className="dish-card">
      <img src={dish.image} alt={dish.name} />
      <h3>{dish.name}</h3>
      <p>{dish.description}</p>
      <p><strong>{dish.price} ₽</strong></p>
      <button onClick={addToCart}>Добавить в корзину</button>
    </div>
  );
}

export default DishCard;