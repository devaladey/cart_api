const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');

exports.signup = async (req, res)=>{
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            isAdmin: req.body.isAdmin
          });

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: 90
        })

        user.password = undefined;
        user.__v = undefined;

        res.status(200).json({
            status: 'Success',
            data: {
                user
            },
            token
        });

    } catch (err) {
        res.status(404).json({
            message: err.message,
            trace: err.trace,
            status: 'Fail'
        });
    }
};

exports.login = async (req, res, next)=>{
    try {
        const { email, password} = req.body;

        if(!email || !password) {
            return next(new Error('Please provide email and password.'));
        }
        
        const user = await User.findOne({email}).select('+password');

        if(!user || !(await user.correctPassword(password, user.password))) {
            return next(new Error('Incorrect email or password!'));
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_COOKIE_EXPIRES_IN
        });

        user.password = undefined;

        // console.log(user);

        res.status(200).json({
            status: 'Success',
            data: {
                user
            },
            token
        });

    } catch (err) {
        res.status(404).json({
            message: err.message,
            trace: err
        });
    }
};

exports.protect = async (req, res, next)=> {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            return next(new Error('You are not logged in login to access this resource.'));
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if(!user) {
            return next(new Error('Invalid token please login.'));
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.updateMe = async (req, res, next)=> {
    try {
        console.log('User id: ', req.user.id, 'User data: ', req.body);
        const user = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'Success',
            data: {
                user
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: '...'
        });
    }
};

exports.restrictTo = async (req, res, next)=> {
    const isAdmin = req.user.isAdmin;

    if(!isAdmin) {
        return next(new Error('You are not authorized to access this route.'));
    } 
    
    next();
};
