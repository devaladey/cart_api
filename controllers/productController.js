const Product = require('../models/productModel');
const Review = require('../models/reviewModel');

exports.getProducts = async (req, res, next)=> {
    try {

        const queryString = {...req.query};
        const noSearchParams = ['sort', 'fields', 'page', 'limit'];

        noSearchParams.forEach(el => {
            delete queryString[el];
        });
        
        let query = Product.find(queryString);

        if(!query) {
            return next(new Error('Invalid search'));
        }

        // Sort the products
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('name');
        }

        // Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 20;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // Selecting specific fields
        if(req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }
        

        

        const products = await query.populate('reviews');

        res.status(200).json({
            status: 'Success',
            numOfProducts: products.length,
            data: {
                products
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.getProductsFilteredByName = async (req, res, next)=> {
    try {

        if(!req.query.searchTerm || req.query.searchTerm.length == 0) {
            return next(new Error(`Request must have a search term`));
        } 

        const products = await Product.find().populate('reviews');

        const filteredProducts = products.filter(el => el.name.toLowerCase().includes(req.query.searchTerm.toLowerCase()));

        console.log(filteredProducts);

        res.status(200).json({
            status: 'Success',
            numOfProducts: filteredProducts.length,
            data: {
                filteredProducts
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }

};

exports.getProduct = async (req, res, next)=> {
    try {
        const product = await Product.findById(req.params.id).populate('reviews');

        res.status(200).json({
            status: 'Success',
            data: {
                product
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.createProduct = async (req, res, next)=> {
    try {
        const product = await Product.create(req.body);

        res.status(200).json({
            status: 'Success',
            data: {
                product
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.updateProduct = async (req, res, next)=> {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
          });

        if(!product) {
            return next(new Error('Product does not exist'));
        }


        res.status(200).json({
            status: 'Success',
            data: {
                product
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.deleteProduct = async (req, res, next)=> {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product) {
            return next(new Error('Product unable to delete'));
        }


        res.status(200).json({
            status: 'Success',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};