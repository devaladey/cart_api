const Order = require('../models/orderModel');

exports.makeOrder = async (req, res, next) => {
    console.log('made orders: ', req.user);
    try {
        const order = await Order.create({
            user: req.user._id,
            products: req.body.products,
            dateOrdered: Date.now()
        });

        res.status(200).json({
            status: 'Success',
            data: {
                order
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('user products');
        res.status(200).json({
            status: 'Success',
            dataSize: orders.length,
            data: {
                orders
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.getOrder = async (req, res, next)=> {
    try {
        const orders = await Order.find({user: req.user._id}).populate('user products');

        if(!orders) {
            next(new Error('You do not have any order yet...'));
        }

        res.status(200).json({
            status: 'Success',
            data: {
                orders
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error.message
        });
    }
};