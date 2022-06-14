const express = require('express');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');
// const reviewController = require('../controllers/reviewController');
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.route('/me').patch(userController.protect, userController.updateMe);
router.route('/me/order').get(userController.protect, orderController.getOrder).post(userController.protect, orderController.makeOrder);
// router.route('/me/review').post(userController.protect, reviewController.createReview);
// router.post('/me/order', userController.protect, orderController.makeOrder);
// router.get('/me/order', userController.protect, orderController.getOrder);

module.exports = router;