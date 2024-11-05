const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skillsController');

router
   .route('/')
   .get(skillsController.getAllCategory)
   .post(skillsController.createCategory)
   .patch(skillsController.updateCategory)
   .delete(skillsController.deleteCategory);

router.route('/insertMany').post(skillsController.insertManyDocuments);
router.route('/paginate').post(skillsController.getSkillPaginate);
router.route('/:id').get(skillsController.getCategoryById);

module.exports = router;
