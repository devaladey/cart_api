const express = require('express');
// const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
// const userController = require('../controllers/userController');
const router = express.Router();

router.route('/').get(orderController.getOrders);

module.exports = router;