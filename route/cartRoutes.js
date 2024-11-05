const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/cartsController');

router
   .route('/')
   .get(cartsController.getCartList)
   .post(cartsController.handleCart)
   .delete(cartsController.deleteCart);

router.route('/get-by-userId/').post(cartsController.getCartListByUserId);
router.route('/update-cart/').post(cartsController.updateCart);

module.exports = router;
