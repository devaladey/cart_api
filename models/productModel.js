const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name.'],
        unique: [true, 'A product name must be unique.']
    },
    countInStock: {
        type: Number,
        required: [true, 'A product must have a quantity in stock'],
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    description: {
        type: String,
        required: [true, 'A product must have a description']
    },
    productUrl: {
        type: String,
        required: true
    },
    reviews: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;