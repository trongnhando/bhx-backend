const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
   {
      userId: {
         type: String,
         require: true,
      },
      name: {
         type: String,
         require: true,
      },
      gender: {
         type: String,
         require: true,
      },
      phone: {
         type: String,
         require: true,
      },
      address: {
         type: String,
         require: true,
      },
      notes: {
         type: String,
         default: '',
      },
      payment_method: {
         type: String,
         default: '',
      },
      total: {
         type: String,
         default: 0,
      },
      productsList: [
         {
            productId: {
               type: String,
               require: true,
            },
            amount: {
               type: Number,
               require: true,
            },
            price: {
               type: String,
               required: true,
            },
            total: {
               type: String,
               default: 0,
            },
         },
      ],
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model('order', orderSchema);
