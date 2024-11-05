const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const validations = require('../validations/productValidation');

router
   .route('/')
   .get(productsController.getAllProduct)
   .post(
      validations.insertProductValidations,
      productsController.insertNewProduct
   )
   .patch(productsController.updateProduct)
   .delete(productsController.deleteProduct);

router.route('/insertMany').post(productsController.insertManyDocuments);
router.route('/search-by-age').get(productsController.getProductByAgeId);
router.route('/search-by-branch').get(productsController.getProductByBranchId);
router.route('/search-by-skill').get(productsController.getProductBySkillId);
router
   .route('/paginate')
   .post(
      validations.getProductPaginateValidations,
      productsController.getProductPaginate
   );
router.route('/get-newest-products').get(productsController.getNewestProduct);
router.route('/:productId').get(productsController.getProductById);

module.exports = router;
