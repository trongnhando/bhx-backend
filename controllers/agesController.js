const asyncHandler = require('express-async-handler');
const Age = require('../models/Age');

// @desc get all categories
// @route GET /categories
// @access private
const getAllCategory = asyncHandler(async (req, res) => {
   try {
      const categories = await Age.find().sort({ ageId: 1 }).lean();
      if (!categories || !categories.length) {
         return res.status(400).json({ message: 'No category found' });
      }
      return res.json(categories);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// @desc create new category
// @route POST /categories
// @access private
const createCategory = asyncHandler(async (req, res) => {
   try {
      const { ageId, ageName } = req.body;
      // confirm data
      if (!ageId || ageId === '0' || !ageName) {
         return res.status(404).json({ message: 'All fields are required' });
      }
      // check for duplicate
      const duplicate = await Age.find({
         $or: [{ ageId: ageId }, { ageName: ageName }],
      })
         .lean()
         .exec();

      if (duplicate && duplicate.length) {
         const arrayError = [];
         if (duplicate.some((value) => value.ageId == ageId)) {
            arrayError.push('ageId');
         }
         if (duplicate.some((value) => value.ageName === ageName)) {
            arrayError.push('ageName');
         }
         return res
            .status(409)
            .json({ message: `${arrayError.join(', ')} already existed` });
      }
      // confirm data
      const categoryObject = {
         ageId: ageId,
         ageName: ageName,
         createdAt: new Date(),
         updatedAt: new Date(),
      };
      // create and store new category
      const category = await Age.create(categoryObject);
      if (category) {
         // created
         return res.status(201).json({
            message: `New category ${ageName} has been created`,
         });
      }
      return res.status(400).json({
         message: 'Invalid category data received',
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// @desc update category
// @route PATCH /categories
// @access private
const updateCategory = asyncHandler(async (req, res) => {
   try {
      const { id, ageName } = req.body;
      // get user by id
      const category = await Age.findById(id).lean().exec();
      if (!category) {
         return res.status(400).json({ message: 'Category not found' });
      }
      // check for duplicate
      const duplicate = await Age.findOne({ ageName }).lean().exec();
      if (duplicate && duplicate._id.toString() !== category._id.toString()) {
         return res
            .status(409)
            .json({ message: `Category name already existed` });
      }
      // confirm update data
      const updateCategory = await Age.updateOne(
         {
            _id: id,
         },
         {
            ageName: ageName,
            updatedAt: new Date(),
         }
      );
      if (updateCategory) {
         return res.json({ message: `Category has been updated` });
      }
      return res.json({ message: 'Update category fail' });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// @desc delete user
// @route DELETE /categories
// @access private
const deleteCategory = asyncHandler(async (req, res) => {
   try {
      const { id } = req.body;
      if (!id) {
         return res.status(404).json({ message: 'Category ID is required' });
      }
      const category = await Age.findById(id).exec();
      if (!category) {
         return res.status(400).json({ message: 'Category not found' });
      }
      const result = await category.deleteOne();
      return res.status(201).json({
         message: `Category ${result.ageName} with ID ${result.ageId} has been deleted`,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// get user by id
const getCategoryById = asyncHandler(async (req, res) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(404).json({ message: 'Category ID is required' });
      }
      const category = await Age.findById(id).exec();
      if (!category) {
         return res.status(400).json({ message: 'Category not found' });
      }
      return res.status(201).json(category);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getAgePaginate = asyncHandler(async (req, res) => {
   try {
      const { perPage, page } = req.body;
      const ages = await Age.find()
         .sort({ ageId: 1 })
         .skip(perPage * (page || 1) - perPage)
         .limit(perPage)
         .exec();
      const count = (await Age.find().exec()).length;
      if (!ages || !ages.length || !count) {
         return res.status(400).json({ message: 'No age category found' });
      }
      return res.json({
         count: count || 0,
         returnCnt: ages.length || 0,
         totalPage: Math.ceil(count / perPage) || 0,
         ages,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const insertManyDocuments = asyncHandler(async (req, res) => {
   try {
      const { documents } = req.body;
      if (!documents || !documents.length) {
         return res.status(404).json({ message: 'List document is required' });
      }
      const options = { ordered: true };
      const result = await Age.insertMany(documents, options);
      return res.status(201).json({
         message: `${result.length} documents were inserted`,
         data: result,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getAllCategory,
   createCategory,
   updateCategory,
   deleteCategory,
   getCategoryById,
   getAgePaginate,
   insertManyDocuments,
};
