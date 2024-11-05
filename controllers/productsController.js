const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const { formatErrValidate } = require('../common/utils');

// get all products
const getAllProduct = asyncHandler(async (req, res) => {
   try {
      const products = await Product.find()
         .populate(['age', 'branch', 'skill'])
         .sort({ createdAt: 1 })
         .exec();
      if (!products || !products.length) {
         return res.json({ message: 'No product found' });
      }
      return res.json(products);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getNewestProduct = asyncHandler(async (req, res) => {
   try {
      const products = await Product.find()
         .populate(['age', 'branch', 'skill'])
         .sort({ createdAt: 1 })
         .limit(4)
         .exec();

      if (!products || !products.length) {
         return res.json({ message: 'No product found' });
      }
      return res.json(products);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// insert product
const insertNewProduct = asyncHandler(async (req, res) => {
   try {
      // validate input values
      const errValidate = validationResult(req);
      if (!errValidate.isEmpty()) {
         return res.json({
            errors: formatErrValidate(errValidate.array()),
            bizResult: '8',
         });
      }

      const payload = req.body;
      // check for duplicate
      const duplicate = await Product.findOne({
         productName: payload.productName,
      })
         .lean()
         .exec();
      if (duplicate) {
         return res.status(409).json({
            message: `Product '${payload.productName}' already existed`,
         });
      }

      // create and store new user
      const product = await Product.create({
         ageId: payload.ageId,
         branchId: payload.branchId,
         skillId: payload.skillId,
         productName: payload.productName,
         price: payload.price,
         describes: payload.describes,
         amount: payload.amount,
         images: payload.images,
      });
      if (product) {
         // created
         return res.status(201).json({
            message: `New product '${payload.productName}' has been created`,
         });
      } else {
         return res.status(400).json({
            message: 'Invalid product data received',
         });
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// insert product
const updateProduct = asyncHandler(async (req, res) => {
   try {
      const {
         productId,
         ageId,
         branchId,
         skillId,
         productName,
         price,
         describes,
         amount,
         images,
      } = req.body;
      const inputArray = [
         productId,
         ageId,
         branchId,
         skillId,
         productName,
         price,
         describes,
         amount,
         images,
      ];
      const product = await Product.findById(productId).exec();
      if (!product) {
         return res.status(400).json({ message: 'Product not found' });
      }
      // get user by id
      if (inputArray.some((value) => !value || value === '')) {
         return res.status(404).json({ message: 'All fields are required' });
      }
      // check for duplicate
      const duplicate = await Product.findOne({ productName }).lean().exec();
      if (duplicate && product._id.toString() !== duplicate._id.toString()) {
         return res.status(409).json({
            message: `Product's name '${productName}' already existed`,
         });
      }
      // confirm update data
      const updateProduct = await Product.updateOne(
         {
            _id: productId,
         },
         {
            ageId: ageId,
            branchId: branchId,
            skillId: skillId,
            productName: productName,
            price: price,
            describes: describes,
            amount: amount,
            images: images,
         }
      );
      if (updateProduct) {
         return res.json({
            message: `${product.productName} has been updated`,
         });
      } else {
         return res.status(400).json({ message: 'Update product fail' });
      }
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
   try {
      const { productId } = req.body;
      if (!productId) {
         return res.status(404).json({ message: 'Product ID is required' });
      }
      const product = await Product.findById(productId).exec();
      if (!product) {
         return res.status(400).json({ message: 'User not found' });
      }
      const result = await product.deleteOne();
      return res.status(201).json({
         message: `Product '${result.productName}' has been deleted`,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// get product by id
const getProductById = asyncHandler(async (req, res) => {
   try {
      const { productId } = req.params;
      if (!productId) {
         return res.status(404).json({ message: 'Product ID is required' });
      }
      const product = await Product.findById(productId)
         .populate(['age', 'branch', 'skill'])
         .exec();
      if (!product) {
         return res.status(400).json({ message: 'Product not found' });
      }
      return res.status(201).json(product);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// get product by category id
const getProductByAgeId = asyncHandler(async (req, res) => {
   try {
      const { ageId } = req.query;
      if (!ageId) {
         return res.status(404).json({ message: 'Age ID is required' });
      }
      const product = await Product.find({ ageId })
         .sort({ createdAt: 1 })
         .populate(['age', 'branch', 'skill'])
         .exec();
      if (!product || !product.length) {
         return res.status(400).json({ message: 'Product not found' });
      }
      return res.status(201).json(product);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// get product by branch id
const getProductByBranchId = asyncHandler(async (req, res) => {
   try {
      const { branchId } = req.query;
      if (!branchId) {
         return res.status(404).json({ message: 'Branch ID is required' });
      }
      const product = await Product.find({ branchId })
         .sort({ createdAt: 1 })
         .populate(['age', 'branch', 'skill'])
         .exec();
      if (!product || !product.length) {
         return res.status(400).json({ message: 'Product not found' });
      }
      return res.status(201).json(product);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

// get product by branch id
const getProductBySkillId = asyncHandler(async (req, res) => {
   try {
      const { skillId } = req.query;
      if (!skillId) {
         return res.status(404).json({ message: 'Skill ID is required' });
      }
      const product = await Product.find({ skillId })
         .sort({ createdAt: 1 })
         .populate(['age', 'branch', 'skill'])
         .exec();
      if (!product || !product.length) {
         return res.status(400).json({ message: 'Product not found' });
      }
      return res.status(201).json(product);
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

const getProductPaginate = asyncHandler(async (req, res) => {
   try {
      const errValidate = validationResult(req);
      if (!errValidate.isEmpty()) {
         return res.json({
            errors: formatErrValidate(errValidate.array()),
            bizResult: '8',
         });
      }

      // get params from request's body
      const { perPage, page, ageId, branchId, skillId, productName } = req.body;
      // format searchObject
      const perPageFormat = perPage || 10;
      const searchObject = getObjectSearchProduct(
         ageId,
         branchId,
         skillId,
         productName
      );
      // get products list
      const products = await Product.find(searchObject)
         .sort({ createdAt: 1 })
         .populate(['age', 'branch', 'skill'])
         .skip(perPageFormat * (page || 1) - perPageFormat)
         .limit(perPageFormat)
         .exec();
      const count = (await Product.find(searchObject).exec()).length;
      if (!products || !products.length) {
         return res.json({ message: 'No product found' });
      }
      return res.json({
         count: count || 0,
         returnCnt: products.length || 0,
         totalPage: Math.ceil(count / perPageFormat) || 0,
         products,
      });
   } catch (error) {
      return res.status(400).json({
         error: {
            message: error.message || '',
         },
      });
   }
});

const getObjectSearchProduct = (ageId, branchId, skillId, productName) => {
   const list = [];
   if (ageId && ageId.length) {
      list.push({
         ageId: {
            $in: ageId || [],
         },
      });
   }
   if (branchId && branchId.length) {
      list.push({
         branchId: {
            $in: branchId || [],
         },
      });
   }
   if (skillId && skillId.length) {
      list.push({
         skillId: {
            $in: skillId || [],
         },
      });
   }
   if (productName) {
      list.push({
         productName: {
            $regex: productName,
            $options: 'i',
         },
      });
   }

   return list.length
      ? {
           $or: list,
        }
      : {};
};

const insertManyDocuments = asyncHandler(async (req, res) => {
   try {
      const { documents } = req.body;
      if (!documents || !documents.length) {
         return res.status(404).json({ message: 'List document is required' });
      }
      const options = { ordered: true };
      const result = await Product.insertMany(documents, options);
      return res.status(201).json({
         message: `${result.length} documents were inserted`,
         data: result,
      });
   } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
   }
});

module.exports = {
   getAllProduct,
   getNewestProduct,
   insertNewProduct,
   updateProduct,
   deleteProduct,
   getProductById,
   getProductByAgeId,
   getProductByBranchId,
   getProductBySkillId,
   getProductPaginate,
   insertManyDocuments,
};
