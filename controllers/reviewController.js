const Product = require('../models/productModel');
const Review = require('../models/reviewModel');

exports.createReview = async (req, res, next)=> {
    try {

        const review = await Review.create({user: req.user._id, comment: req.body.comment});
        const product = await Product.findById(req.params.id);

        if(!product) {
            return next(new Error('Product does not exist'));
        }
        product.reviews = [...product.reviews, review._id];
        await product.save();
        

        res.status(200).json({
            status: 'Success',
            data: {
                review
            }
        });
        
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error.message
        });
    }
};