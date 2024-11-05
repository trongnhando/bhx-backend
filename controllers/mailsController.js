const asyncHandler = require('express-async-handler');
const Mail = require('../models/Mail');

const getAllMails = asyncHandler(async (req, res) => {
   try {
      const mails = await Mail.find().sort({ createdAt: 1 }).lean();
      if (!mails || !mails.length) {
         return res.status(200).json({ message: 'No mail found' });
      }
      return res.json(mails);
   } catch (error) {
      return res.status(400).json({ error: error, message: "Server's error" });
   }
});

const insertMail = asyncHandler(async (req, res) => {
   try {
      const { email } = req.body;

      if (!email) {
         return res.status(404).json({ message: 'Email is required' });
      }

      const duplicate = await Mail.find({ email: email }).lean().exec();

      if (duplicate && duplicate.length) {
         return res.status(409).json({ message: `Email already registered` });
      }

      const newMailObject = {
         email: email,
         createdAt: new Date(),
         updatedAt: new Date(),
      };

      const role = await Mail.create(newMailObject);
      if (role) {
         return res.status(201).json({
            message: `Email has been registered successfully`,
         });
      }
      return res.status(400).json({
         message: 'Invalid mail data received',
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getAllMails,
   insertMail,
};
