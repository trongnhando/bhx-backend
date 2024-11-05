const express = require('express');
const router = express.Router();
const branchesController = require('../controllers/branchesController');

router
   .route('/')
   .get(branchesController.getAllCategory)
   .post(branchesController.createCategory)
   .patch(branchesController.updateCategory)
   .delete(branchesController.deleteCategory);

router.route('/insertMany').post(branchesController.insertManyDocuments);
router.route('/paginate').post(branchesController.getBranchPaginate);
router.route('/:id').get(branchesController.getCategoryById);

module.exports = router;
