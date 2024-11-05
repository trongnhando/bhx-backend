const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
   {
      roleId: {
         type: Number,
         require: true,
      },
      roleName: {
         type: String,
         require: true,
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model('role', roleSchema);
