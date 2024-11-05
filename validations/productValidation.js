const { body } = require('express-validator');

module.exports.getProductPaginateValidations = [
   body('perPage').notEmpty().withMessage('This field is a required field'),
   body('page').notEmpty().withMessage('This field is a required field'),
];

module.exports.insertProductValidations = [
   body('ageId').notEmpty().withMessage('This field is a required field'),
   body('branchId').notEmpty().withMessage('This field is a required field'),
   body('skillId').notEmpty().withMessage('This field is a required field'),
   body('productName').notEmpty().withMessage('This field is a required field'),
   body('price').notEmpty().withMessage('This field is a required field'),
   body('describes').notEmpty().withMessage('This field is a required field'),
   body('amount').notEmpty().withMessage('This field is a required field'),
   body('images').notEmpty().withMessage('This field is a required field'),
];
