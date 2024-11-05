const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
   {
      username: {
         type: String,
         require: true,
      },
      password: {
         type: String,
         require: true,
      },
      roleId: {
         type: Number,
         default: 1,
      },
      active: {
         type: Boolean,
         default: true,
      },
   },
   {
      timestamps: true,
   }
);

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

// role Model
userSchema.virtual('role', {
   ref: 'role',
   localField: 'roleId',
   foreignField: 'roleId',
   justOne: true,
});

module.exports = mongoose.model('user', userSchema);
