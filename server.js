const dotenv = require('dotenv');

const mongoose = require('mongoose');

dotenv.config({path: `${__dirname}/config.env`});

const app = require('./app');

const PORT = process.env.PORT || 5000;

mongoose.
connect(process.env.DB)
.then(()=> {
    console.log('Database connection successful.');
    app.listen(PORT, ()=> {
        console.log(`Server running at port ${PORT}`);
    });
}).catch(error => {
    console.log('Error connecting to database', error);
});




