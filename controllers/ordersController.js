const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const getOrdersList = asyncHandler(async (req, res) => {
   try {
      const ordersList = await Order.find().sort({ createdAt: 1 }).lean();
      if (ordersList && ordersList.length) {
         return res.json(ordersList);
      }
      return res.json({ message: 'The order list is empty!' });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const createNewOrder = asyncHandler(async (req, res) => {
   try {
      const {
         userId,
         name,
         gender,
         phone,
         address,
         notes,
         payment_method,
         total,
         productsList,
      } = req.body;
      /** items required */
      const inputArray = [
         userId,
         name,
         gender,
         phone,
         address,
         payment_method,
         total,
         productsList,
      ];
      /** check required item */
      if (inputArray.some((value) => !value || value === '')) {
         return res.status(404).json({ message: 'All fields are required' });
      }

      const orderObject = {
         userId: userId,
         name: name,
         gender: gender,
         phone: phone,
         address: address,
         notes: notes || '',
         payment_method: payment_method,
         total: total,
         productsList: productsList,
      };

      const product = await Order.create(orderObject);
      if (product) {
         const resDelete = await Cart.deleteMany({
            userId: userId,
         });
         if (resDelete) {
            return res.status(201).json({
               message: `Order successfully`,
            });
         }
      }

      return res.status(400).json({
         message: 'Order failed',
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getOrdersList,
   createNewOrder,
};
