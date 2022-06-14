const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'An order must have a user'],
        ref: 'User'
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'An order must have at least one product'],
            ref: 'Product'
        }
    ],
    dateOrder: {
        type: Date,
    }
});





const Order = mongoose.model('Order', orderSchema);

module.exports = Order;