const express = require('express');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const app = express();

app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/order', orderRouter);


app.all('*', (req, res, next) => {
    next(new Error(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use((error, req, res, next) => {
    res.status(404).json({
        message: error.message,
        stackTrace: error.stack
    });
});

module.exports = app;