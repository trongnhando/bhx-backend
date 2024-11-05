const express = require('express');
const router = express.Router();
const mailsController = require('../controllers/mailsController');

router
   .route('/')
   .get(mailsController.getAllMails)
   .post(mailsController.insertMail);

module.exports = router;
