const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
   {
      userId: {
         type: String,
         require: true,
      },
      productId: {
         type: String,
         require: true,
      },
      price: {
         type: String,
         required: true,
      },
      amount: {
         type: Number,
         require: true,
      },
      total: {
         type: String,
         default: 0,
      },
   },
   {
      timestamps: true,
   }
);

cartSchema.set('toObject', { virtuals: true });
cartSchema.set('toJSON', { virtuals: true });

cartSchema.virtual('product', {
   ref: 'product',
   localField: 'productId',
   foreignField: '_id',
   justOne: true,
});

cartSchema.virtual('user', {
   ref: 'user',
   localField: 'userId',
   foreignField: '_id',
   justOne: true,
});

module.exports = mongoose.model('cart', cartSchema);
