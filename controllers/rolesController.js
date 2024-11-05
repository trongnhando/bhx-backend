const asyncHandler = require('express-async-handler');
const Role = require('../models/Role');

const getAllRoles = asyncHandler(async (req, res) => {
   try {
      const roles = await Role.find().sort({ roleId: 1 }).lean();
      if (!roles || !roles.length) {
         return res.status(400).json({ message: 'No role found' });
      }
      return res.json(roles);
   } catch (error) {
      return res.status(400).json({ error: error, message: "Server's error" });
   }
});

const createRole = asyncHandler(async (req, res) => {
   try {
      const { roleId, roleName } = req.body;
      // confirm data
      if (!roleId || roleId == 0 || !roleName) {
         return res.status(404).json({ message: 'All fields are required' });
      }
      // check for duplicate
      const duplicate = await Role.find({
         $or: [{ roleId: roleId }, { roleName: roleName }],
      })
         .lean()
         .exec();

      if (duplicate && duplicate.length) {
         const arrayError = [];
         if (duplicate.some((value) => value.roleId == roleId)) {
            arrayError.push('roleId');
         }
         if (duplicate.some((value) => value.roleName === roleName)) {
            arrayError.push('roleName');
         }
         return res
            .status(409)
            .json({ message: `${arrayError.join(', ')} already existed` });
      }
      // confirm data
      const roleObject = {
         roleId: roleId,
         roleName: roleName,
         createdAt: new Date(),
         updatedAt: new Date(),
      };
      // create and store new role
      const role = await Role.create(roleObject);
      if (role) {
         // created
         return res.status(201).json({
            message: `New role ${roleName} has been created`,
         });
      }
      return res.status(400).json({
         message: 'Invalid role data received',
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const updateRole = asyncHandler(async (req, res) => {
   try {
      const { id, roleName } = req.body;
      // get user by id
      const role = await Role.findById(id).lean().exec();
      if (!role) {
         return res.status(400).json({ message: 'Role not found' });
      }
      // check for duplicate
      const duplicate = await Role.findOne({ roleName }).lean().exec();
      if (duplicate && duplicate._id.toString() !== role._id.toString()) {
         return res.status(409).json({ message: `role name already existed` });
      }
      // confirm update data
      const updateRole = await Role.updateOne(
         {
            _id: id,
         },
         {
            roleName: roleName,
            updatedAt: new Date(),
         }
      );
      if (updateRole) {
         return res.json({ message: `Role has been updated` });
      }
      return res.json({ message: 'Update Role fail' });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const deleteRole = asyncHandler(async (req, res) => {
   try {
      const { id } = req.body;
      if (!id) {
         return res.status(404).json({ message: 'Role Id is required' });
      }
      const role = await Role.findById(id).exec();
      if (!role) {
         return res.status(400).json({ message: 'Role not found' });
      }
      const result = await role.deleteOne();
      return res.status(201).json({
         message: `role ${result.roleName} with ID ${result.roleId} has been deleted`,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getRoleById = asyncHandler(async (req, res) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(404).json({ message: 'Role Id is required' });
      }
      const role = await Role.findById(id).exec();
      if (!role) {
         return res.status(400).json({ message: 'Role not found' });
      }
      return res.status(201).json(role);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getRolePaginate = asyncHandler(async (req, res) => {
   try {
      const { perPage, page } = req.body;
      const roles = await Role.find()
         .sort({ roleId: 1 })
         .skip(perPage * (page || 1) - perPage)
         .limit(perPage)
         .exec();
      const count = (await Role.find().exec()).length;
      if (!roles || !roles.length || !count) {
         return res.status(400).json({ message: 'No role found' });
      }
      return res.json({
         count: count || 0,
         returnCnt: roles.length || 0,
         totalPage: Math.ceil(count / perPage) || 0,
         roles,
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
      const result = await Role.insertMany(documents, options);
      return res.status(201).json({
         message: `${result.length} documents were inserted`,
         data: result,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getAllRoles,
   createRole,
   updateRole,
   deleteRole,
   getRoleById,
   getRolePaginate,
   insertManyDocuments,
};
