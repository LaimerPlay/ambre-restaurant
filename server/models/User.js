// server/models/User.js

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bonusPoints: { type: Number, default: 0 },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);