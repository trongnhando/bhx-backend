const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router
   .route('/')
   .get(usersController.getAllUser)
   .post(usersController.createUser)
   .patch(usersController.updateUser)
   .delete(usersController.deleteUser);

router.route('/insertMany').post(usersController.insertManyDocuments);
router.route('/login-user').post(usersController.loginUser);
router.route('/login-admin').post(usersController.loginAdmin);
router.route('/sort').post(usersController.getSortedData);
router.route('/paginate').post(usersController.getUserPaginate);
router.route('/:id').get(usersController.getUserById);

module.exports = router;
