const asyncHandler = require('express-async-handler');
const md5 = require('md5');
const User = require('../models/User');

// @desc get all users
// @route GET /users
// @access private
const getAllUser = asyncHandler(async (req, res) => {
   try {
      const users = await User.find()
         .populate(['role'])
         .sort({ createdAt: 1 })
         .select('-password')
         .lean();
      if (!users || !users.length) {
         return res.status(400).json({ message: 'No users found' });
      }
      return res.json(users);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// login for user
const loginUser = asyncHandler(async (req, res) => {
   try {
      const { username, password } = req.body;
      if (!username || !password) {
         return res
            .status(400)
            .json({ message: 'Username and password are required' });
      }
      const user = await User.findOne({
         username,
         password: md5(password),
         roleId: 1,
      })
         .populate(['role'])
         .select('-password')
         .lean()
         .exec();
      if (!user) {
         return res
            .status(401)
            .json({ message: 'Username or password incorrect' });
      } else {
         return res.status(200).json(user);
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// login for admin, ...
const loginAdmin = asyncHandler(async (req, res) => {
   try {
      const { username, password } = req.body;
      if (!username || !password) {
         return res
            .status(400)
            .json({ message: 'Username and password are required' });
      }
      const user = await User.findOne({
         username,
         password: md5(password),
         roleId: { $in: [2, 3, 4, 5] },
      })
         .populate(['role'])
         .select('-password')
         .lean()
         .exec();
      if (!user) {
         return res
            .status(401)
            .json({ message: 'Username or password incorrect' });
      } else {
         return res.status(200).json(user);
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// @desc create new user
// @route POST /users
// @access private
const createUser = asyncHandler(async (req, res) => {
   try {
      // get params from request's body
      const { username, password, roleId, active } = req.body;
      // confirm data
      if (!username && !password) {
         return res.status(404).json({ message: 'All fields are required' });
      }
      // check for duplicate
      const duplicate = await User.findOne({ username }).lean().exec();
      if (duplicate) {
         return res.status(409).json({ message: `Username already existed` });
      }
      const userObject = {
         username: username,
         password: md5(password),
         roleId: roleId || 1,
         active:
            active !== undefined && typeof active === Boolean ? active : true,
      };
      // create and store new user
      const user = await User.create(userObject);
      if (user) {
         // created
         return res.status(201).json({
            message: `New user ${username} has been created`,
         });
      } else {
         return res.status(400).json({
            message: 'Invalid user data received',
         });
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// @desc update user
// @route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
   try {
      const { id, username, roleId, active, password } = req.body;
      if (!id || id === '' || id === undefined) {
         return res.status(400).json({ message: 'User Id not found' });
      }
      // get user by id
      const user = await User.findById(id).exec();
      if (!user) {
         return res.status(400).json({ message: 'User not found' });
      }
      // check for duplicate
      const duplicate = await User.findOne({ username }).lean().exec();
      if (duplicate && user._id.toString() !== duplicate._id.toString()) {
         return res
            .status(409)
            .json({ message: `Username '${username}' already existed` });
      }
      // confirm update data
      const updateUser = await User.updateOne(
         {
            _id: id,
         },
         {
            username: username || user.username,
            password: md5(password) || user.password,
            roleId: roleId || user.roleId,
            active: active || user.active,
            updatedAt: new Date(),
         }
      );
      if (updateUser) {
         return res
            .status(201)
            .json({ updateUser, message: 'Account has been updated' });
      } else {
         return res.status(400).json({ message: 'Update user fail' });
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// @desc delete user
// @route DELETE /users
// @access private
const deleteUser = asyncHandler(async (req, res) => {
   try {
      const { id } = req.body;
      if (!id) {
         return res.status(404).json({ message: 'User ID is required' });
      }
      const user = await User.findById(id).exec();
      if (!user) {
         return res.status(400).json({ message: 'User not found' });
      }
      const result = await user.deleteOne();
      return res.status(201).json({
         message: `Username '${result.username}' has been deleted`,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// get user by id
const getUserById = asyncHandler(async (req, res) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(404).json({ message: 'User ID is required' });
      }
      const user = await User.findById(id)
         .select('-password')
         .populate(['role'])
         .lean()
         .exec();
      if (!user) {
         return res.status(400).json({ message: 'User not found' });
      }
      return res.status(201).json(user);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getSortedData = asyncHandler(async (req, res) => {
   try {
      const { column, condition } = req.body;
      const sortOptions = {
         [column]: condition,
      };
      const users = await User.find()
         .populate(['role'])
         .sort(sortOptions)
         .select('-password')
         .lean();
      if (!users || !users.length) {
         return res.status(400).json({ message: 'No users found' });
      }
      return res.json(users);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getUserPaginate = asyncHandler(async (req, res) => {
   try {
      const { perPage, page } = req.body;
      const users = await User.find()
         .populate(['role'])
         .select('-password')
         .sort({ createdAt: 1 })
         .skip(perPage * (page || 1) - perPage)
         .limit(perPage)
         .lean()
         .exec();
      const count = (await User.find().exec()).length;
      if (!users || !users.length || !count) {
         return res.status(400).json({ message: 'No users found' });
      }
      return res.json({
         count: count || 0,
         returnCnt: users.length || 0,
         totalPage: Math.ceil(count / perPage) || 0,
         users,
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
      const result = await User.insertMany(documents, options);
      return res.status(201).json({
         message: `${result.length} documents were inserted`,
         data: result,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getAllUser,
   createUser,
   updateUser,
   deleteUser,
   getUserById,
   loginUser,
   getSortedData,
   getUserPaginate,
   insertManyDocuments,
   loginAdmin,
};
