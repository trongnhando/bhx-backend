const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         require: true,
      },
      author: {
         type: String,
         require: true,
      },
      content: {
         type: String,
         require: true,
      },
      thumbnail: {
         type: String,
         require: true,
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model('blog', blogSchema);
