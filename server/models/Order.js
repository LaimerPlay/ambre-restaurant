import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Теперь можно связать с моделью User
    required: false
  },
  userName: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  deliveryType: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true
  },
  address: {
    type: String,
    validate: {
      validator: function (v) {
        return this.deliveryType !== 'delivery' || !!v;
      },
      message: 'Адрес обязателен при доставке'
    }
  },
  pickupAddress: {
    type: String,
    validate: {
      validator: function (v) {
        return this.deliveryType !== 'pickup' || !!v;
      },
      message: 'Адрес самовывоза обязателен при выборе самовывоза'
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online'],
    required: true
  },
  items: [{
    dishId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    weight: { type: String }
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['новый', 'в обработке', 'готов', 'доставляется', 'завершён'],
    default: 'новый'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', OrderSchema);