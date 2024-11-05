const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router
   .route('/')
   .get(ordersController.getOrdersList)
   .post(ordersController.createNewOrder);

module.exports = router;
