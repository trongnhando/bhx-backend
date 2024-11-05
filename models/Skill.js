const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
   {
      skillId: {
         type: Number,
      },
      skillName: {
         type: String,
         require: true,
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model('skill', skillSchema);
