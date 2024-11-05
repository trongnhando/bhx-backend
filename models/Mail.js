const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         require: true,
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model('mail', mailSchema);
