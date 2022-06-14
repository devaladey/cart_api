const express = require('express');
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const router = express.Router();


router.get('/filter', productController.getProductsFilteredByName)
router.route('/').get(productController.getProducts).post(userController.protect, userController.restrictTo, productController.createProduct);



router.post('/:id/review', userController.protect, reviewController.createReview);
// router.post('/review', reviewController.getReview);

router.route('/:id').get(productController.getProduct).patch(userController.protect, userController.restrictTo, productController.updateProduct).delete(userController.protect, userController.restrictTo, productController.deleteProduct);

module.exports = router;