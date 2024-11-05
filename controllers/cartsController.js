const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

const getCartList = asyncHandler(async (req, res) => {
   try {
      const cartList = await Cart.find()
         .populate(['product', 'user'])
         .sort({ createdAt: 1 })
         .lean();
      if (!cartList || !cartList.length) {
         return res.json({ message: 'No cart found' });
      }
      return res.json(cartList);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getCartListByUserId = asyncHandler(async (req, res) => {
   try {
      const { userId } = req.body;
      const cartList = await Cart.find({ userId: userId })
         .populate([
            {
               path: 'product',
               populate: [
                  { path: 'branch' },
                  { path: 'age' },
                  { path: 'skill' },
               ],
            },
            {
               path: 'user',
               populate: { path: 'role' },
            },
         ])
         .sort({ createdAt: 1 })
         .lean();

      if (!cartList || !cartList.length) {
         return res.json({ message: 'No cart found' });
      }
      return res.json(cartList);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const handleCart = asyncHandler(async (req, res) => {
   try {
      const { userId, productId, price, amount } = req.body;
      // confirm data
      if (!userId || !productId || !price || !amount) {
         return res.status(404).json({ message: 'All fields are required' });
      }
      // check for duplicate
      const duplicate = await Cart.findOne({
         userId: userId,
         productId: productId,
      })
         .lean()
         .exec();
      if (duplicate) {
         const newAmount = parseFloat(duplicate.amount) + parseFloat(amount);
         const updateCart = await Cart.updateOne(
            {
               userId: userId,
               productId: productId,
            },
            {
               amount: newAmount,
               price: price,
               total: newAmount * price,
               updatedAt: new Date(),
            }
         );
         if (updateCart) {
            return res.json({ message: `Cart has been updated` });
         }
         return res.json({ message: 'Update Cart fail' });
      } else {
         const cartObject = {
            userId: userId,
            productId: productId,
            amount: amount,
            price: price,
            total: amount * price,
            createdAt: new Date(),
            updatedAt: new Date(),
         };
         const result = await Cart.create(cartObject);
         if (result) {
            return res.status(201).json({
               message: `New product has been added`,
            });
         }
         return res.status(400).json({
            message: 'Invalid data received',
         });
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const updateCart = asyncHandler(async (req, res) => {
   try {
      const { userId, cartItem } = req.body;
      const checkRequire =
         cartItem &&
         cartItem.length &&
         cartItem.every(
            (value) => value.productId && value.amount && value.price
         );
      if (userId && checkRequire) {
         cartItem.map(async (value) => {
            await Cart.updateOne(
               {
                  userId: userId,
                  productId: value.productId,
               },
               {
                  amount: value.amount,
                  price: value.price,
                  total:
                     parseFloat(value.amount || 0) *
                     parseFloat(value.price || 0),
                  updatedAt: new Date(),
               }
            );
         });
         return res.status(201).json({
            message: `Updated cart success`,
         });
      } else {
         return res.status(404).json({ message: 'All fields are required' });
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const deleteCart = asyncHandler(async (req, res) => {
   try {
      const { id } = req.body;
      if (!id) {
         return res.status(404).json({ message: 'Cart ID is required' });
      }
      const cartTarget = await Cart.findById(id).exec();
      if (!cartTarget) {
         return res.status(400).json({ message: 'Cart not found' });
      }
      const result = await cartTarget.deleteOne();
      if (result) {
         return res.status(201).json({
            message: `Cart has been deleted`,
         });
      } else {
         return res.status(401).json({ message: 'Delete cart failed' });
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getCartList,
   handleCart,
   getCartListByUserId,
   deleteCart,
   updateCart,
};
