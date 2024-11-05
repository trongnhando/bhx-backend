const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
   {
      ageId: {
         type: Number,
         require: true,
      },
      branchId: {
         type: Number,
         require: true,
      },
      skillId: {
         type: Number,
         require: true,
      },
      productName: {
         type: String,
         require: true,
      },
      price: {
         type: String,
         require: true,
      },
      describes: {
         type: String,
      },
      amount: {
         type: Number,
         require: true,
      },
      rate: {
         type: Number,
         default: 0,
      },
      rateAmount: {
         type: Number,
         default: 0,
         require: false,
      },
      images: [
         {
            type: String,
            require: true,
         },
      ],
   },
   {
      timestamps: true,
   }
);

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

// age Model
productSchema.virtual('age', {
   ref: 'age',
   localField: 'ageId',
   foreignField: 'ageId',
   justOne: true,
});
// branch Model
productSchema.virtual('branch', {
   ref: 'branch',
   localField: 'branchId',
   foreignField: 'branchId',
   justOne: true,
});
// skill Model
productSchema.virtual('skill', {
   ref: 'skill',
   localField: 'skillId',
   foreignField: 'skillId',
   justOne: true,
});

module.exports = mongoose.model('product', productSchema);
