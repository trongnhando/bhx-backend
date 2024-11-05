const asyncHandler = require('express-async-handler');
const Skill = require('../models/Skill');

// @desc get all categories
// @route GET /categories
// @access private
const getAllCategory = asyncHandler(async (req, res) => {
   try {
      const categories = await Skill.find().sort({ skillId: 1 }).lean();
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
      const { skillId, skillName } = req.body;
      // confirm data
      if (!skillId || !skillName) {
         return res.status(404).json({ message: 'All fields are required' });
      }
      // check for duplicate
      const duplicate = await Skill.find({
         $or: [{ skillId: skillId }, { skillName: skillName }],
      })
         .lean()
         .exec();

      if (duplicate && duplicate.length) {
         const arrayError = [];
         if (duplicate.some((value) => value.skillId == skillId)) {
            arrayError.push('skillId');
         }
         if (duplicate.some((value) => value.skillName === skillName)) {
            arrayError.push('skillName');
         }
         return res
            .status(409)
            .json({ message: `${arrayError.join(', ')} already existed` });
      }
      // confirm data
      const categoryObject = {
         skillId: skillId,
         skillName: skillName,
         createdAt: new Date(),
         updatedAt: new Date(),
      };
      // create and store new category
      const category = await Skill.create(categoryObject);
      if (category) {
         // created
         return res.status(201).json({
            message: `New category ${skillName} has been created`,
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
      const { id, skillName } = req.body;
      // get user by id
      const category = await Skill.findById(id).lean().exec();
      if (!category) {
         return res.status(400).json({ message: 'Category not found' });
      }
      // check for duplicate
      const duplicate = await Skill.findOne({ skillName }).lean().exec();
      if (duplicate && category._id.toString() !== duplicate._id.toString()) {
         return res.status(409).json({
            message: `Skill Category Name '${skillName}' already existed`,
         });
      }
      // confirm update data
      const updateCategory = await Skill.updateOne(
         {
            _id: id,
         },
         {
            skillName: skillName,
            updatedAt: new Date(),
         }
      );
      if (updateCategory) {
         return res.json({ message: `Category has been updated` });
      } else {
         return res.status(400).json({ message: 'Update category fail' });
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

      const category = await Skill.findById(id).exec();
      if (!category) {
         return res.status(400).json({ message: 'Category not found' });
      }
      const result = await category.deleteOne();
      return res.status(201).json({
         message: `Category ${result.skillName} with ID ${result.skillId} has been deleted`,
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
      const category = await Skill.findById(id).exec();
      if (!category) {
         return res.status(400).json({ message: 'Category not found' });
      }
      return res.status(201).json(category);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getSkillPaginate = asyncHandler(async (req, res) => {
   try {
      const { perPage, page } = req.body;
      const skills = await Skill.find()
         .sort({ skillId: 1 })
         .skip(perPage * (page || 1) - perPage)
         .limit(perPage)
         .exec();
      const count = (await Skill.find().exec()).length;
      if (!skills || !skills.length || !count) {
         return res.status(400).json({ message: 'No skill found' });
      }
      return res.json({
         count: count || 0,
         returnCnt: skills.length || 0,
         totalPage: Math.ceil(count / perPage) || 0,
         skills,
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
      const result = await Skill.insertMany(documents, options);
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
   getSkillPaginate,
   insertManyDocuments,
};
