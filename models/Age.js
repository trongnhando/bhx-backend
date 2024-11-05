const mongoose = require('mongoose');

const ageSchema = new mongoose.Schema(
   {
      ageId: {
         type: Number,
      },
      ageName: {
         type: String,
         require: true,
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model('age', ageSchema);
