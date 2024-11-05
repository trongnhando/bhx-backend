const asyncHandler = require('express-async-handler');
const Branch = require('../models/Branch');

// @desc get all categories
// @route GET /categories
// @access private
const getAllCategory = asyncHandler(async (req, res) => {
   try {
      const categories = await Branch.find().sort({ branchId: 1 }).lean();
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
      const { branchId, branchName, establish } = req.body;
      // confirm data
      if (!branchId || !branchName || !establish) {
         return res.status(404).json({ message: 'All fields are required' });
      }
      // check for duplicate
      const duplicate = await Branch.find({
         $or: [{ branchId: branchId }, { branchName: branchName }],
      })
         .lean()
         .exec();

      if (duplicate && duplicate.length) {
         const arrayError = [];
         if (duplicate.some((value) => value.branchId == branchId)) {
            arrayError.push('branchId');
         }
         if (duplicate.some((value) => value.branchName === branchName)) {
            arrayError.push('branchName');
         }
         return res
            .status(409)
            .json({ message: `${arrayError.join(', ')} already existed` });
      }
      // confirm data
      const categoryObject = {
         branchId: branchId,
         branchName: branchName,
         establish: establish,
         createdAt: new Date(),
         updatedAt: new Date(),
      };
      // create and store new category
      const category = await Branch.create(categoryObject);
      if (category) {
         // created
         return res.status(201).json({
            message: `New category ${branchName} has been created`,
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
      const { id, branchName, establish } = req.body;
      // get category by id
      const category = await Branch.findById(id).lean().exec();
      if (!category) {
         return res.status(400).json({ message: 'Category not found' });
      }
      // check for duplicate
      const duplicate = await Branch.findOne({ branchName }).lean().exec();
      if (duplicate && category._id.toString() !== duplicate._id.toString()) {
         return res
            .status(409)
            .json({ message: `Category Name '${branchName}' already existed` });
      }
      // confirm update data
      const updateCategory = await Branch.updateOne(
         {
            _id: id,
         },
         {
            branchName: branchName,
            establish: establish || category.establish,
            updatedAt: new Date(),
         }
      );
      if (updateCategory) {
         return res.json({ message: `Category has been updated` });
      } else {
         return res.json({ message: 'Update category fail' });
      }
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

      const category = await Branch.findById(id).exec();
      if (!category) {
         return res.status(400).json({ message: 'Category not found' });
      }
      const result = await category.deleteOne();
      return res.status(201).json({
         message: `Category ${result.branchName} with ID ${result.branchId} has been deleted`,
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
      const category = await Branch.findById(id).exec();
      if (!category) {
         return res.status(400).json({ message: 'Category not found' });
      }
      return res.status(201).json(category);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getBranchPaginate = asyncHandler(async (req, res) => {
   try {
      const { perPage, page } = req.body;
      const branches = await Branch.find()
         .sort({ branchId: 1 })
         .skip(perPage * (page || 1) - perPage)
         .limit(perPage)
         .exec();
      const count = (await Branch.find().exec()).length;
      if (!branches || !branches.length || !count) {
         return res.status(400).json({ message: 'No branch category found' });
      }
      return res.json({
         count: count || 0,
         returnCnt: branches.length || 0,
         totalPage: Math.ceil(count / perPage),
         branches,
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
      const result = await Branch.insertMany(documents, options);
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
   getBranchPaginate,
   insertManyDocuments,
};
