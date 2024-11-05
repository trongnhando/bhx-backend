const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { logger } = require('../middleware/logger');
const errorHandler = require('../middleware/errorHandler');
// const corsOptions = require("./config/corsOptions");

const root = require('./root');
const userRoutes = require('./userRoutes');
const ageRoutes = require('./ageRoutes');
const branchRoutes = require('./branchRoutes');
const skillRoutes = require('./skillRoutes');
const productRoutes = require('./productRoutes');
const roleRoutes = require('./roleRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const mailRoutes = require('./mailRoutes');

const route = (app) => {
    app.use(logger);

    // app.use(cors(corsOptions))
    app.use(
        cors({
            origin: '*',
        })
    );

    app.use(express.json());

    app.use(cookieParser());

    app.use('/', express.static(path.join(__dirname, 'public')));

    app.use('/', root);

    /** route for users */
    app.use('/users', userRoutes);

    /** route for ages */
    app.use('/ages', ageRoutes);

    /** route for branches */
    app.use('/branches', branchRoutes);

    /** route for skills */
    app.use('/skills', skillRoutes);

    /** route for products */
    app.use('/products', productRoutes);

    /** route for roles */
    app.use('/roles', roleRoutes);

    /** route for carts */
    app.use('/carts', cartRoutes);

    /** route for orders */
    app.use('/orders', orderRoutes);

    /** route for mails */
    app.use('/mails', mailRoutes);

    app.all('*', (req, res) => {
        res.status(404);
        if (req.accepts('html')) {
            res.sendFile(path.join(__dirname, 'views', '404.html'));
        } else if (req.accepts('json')) {
            res.json({
                message: '404 Not Found',
            });
        } else {
            res.type('txt').send('404 Not Found');
        }
    });

    app.use(errorHandler);
};

module.exports = route;
