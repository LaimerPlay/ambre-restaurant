import React, { useState } from 'react';
import './DishEditor.css';

function DishEditor({ dish }) {
  const [name, setName] = useState(dish.name);
  const [price, setPrice] = useState(dish.price);
  const [description, setDescription] = useState(dish.description);
  const [image, setImage] = useState(dish.image);

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:5000/api/dishes/${dish._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, description, image }),
      });

      alert('Блюдо обновлено!');
    } catch (err) {
      console.error('Ошибка сохранения блюда:', err.message);
      alert('Не удалось обновить блюдо');
    }
  };

  return (
    <div className="dish-editor">
      <img src={image} alt={name} />
      <div className="dish-details">
        <h3>{name}</h3>
        <p>{description}</p>
        <p>Цена: {price} ₽</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
        />
        <button onClick={handleSave}>Сохранить</button>
      </div>
    </div>
  );
}

export default DishEditor;