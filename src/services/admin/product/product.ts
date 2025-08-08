import { Request, Response } from "express";
import {
  validateAdd,
  validateUpdate,
  validateStatus,
  validateDelete,
  Product,
} from "./_validation";
import _ from "lodash";
import { fileUpload } from "../../../helper/upload";
import { model } from "mongoose";
import { optionSchema } from "../../../models/option";
export const Option = model("option", optionSchema);

export const list = async (req: Request, res: Response) => {
  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  const product = await Product.find({
    $and: [filter],
    storeId: req.body.storeId
  })
    .populate("category", { name: 1, image: 1, icon: 1 })
    .populate("subCategory", { name: 1, icon: 1 })
    .sort({ _id: -1 })
    .lean();

    const productsWithOptionCount = await Promise.all(
      product.map(async (product: any) => {
        const options = await Option.find({ productId: product._id, storeId: req.body.storeId });
        const optionStockSum = await Option.aggregate([
          { $match: { productId: product._id , storeId: req.body.storeId} },
          { $group: { _id: null, totalStock: { $sum: "$stock" } } },
        ]);
  
       
        const productStockCount = optionStockSum.length > 0 ? optionStockSum[0].totalStock : 0;
  
        product.stock = productStockCount;
        product.options=options
  
        return product;
      })
    );
  res.status(200).json({ data: productsWithOptionCount });
};

export const add = async (req: Request, res: Response) => {
  try{
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let product: any = await Product.findOne({ name: req.body.name,storeId: req.body.storeId });
  if (product)return res.status(400).json({ error: { name: "Name is already exists." } });

  let newProduct: any = new Product(
    _.pick(req.body, [
      "name",
      "category",
      "subCategory",
      "imageList",
      "description",
      "image",
      "status",
      'storeId'
    ])
  );
  newProduct = await newProduct.save();
  if (req.body.options && req.body.options.length > 0) {
    const optionsData = req.body.options.map((option: any) => ({
      productId: newProduct._id, 
      title: option.title,
      mass:option.mass,
      stock:option.stock,
      price:option.price,
      storeId:req.body.storeId
    }));

    // Save options
    await Option.insertMany(optionsData);
  }
  const options = await Option.find({ productId: newProduct._id ,storeId:req.body.storeId });
  res.status(200).json({ message: "Product added successfully.",data:newProduct ,options:options });
}catch(err){
  console.log(err);
  res.status(200).json({
    message:err,
  })
  
}
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let productName: any = await Product.findOne({
    name: req.body.name,
    _id: { $ne: req.body.id },
    storeId: req.body.storeId,
  });
  if (productName)
    return res.status(400).json({ error: { name: "Name is already exists." } });

  let product: any = await Product.findOne({ _id: req.body.id, storeId: req.body.storeId });
  if (!product) {return res.status(400).json({ message: "No record found." });}

  product.name = req.body.name;
  if (req.body.image) product.image = req.body.image;
  if (req.body.imageList) product.imageList = req.body.imageList;
  if (req.body.description) product.description = req.body.description;
  // if (req.body.price) product.price = req.body.price;
  if (req.body.category) product.category = req.body.category;
  if (req.body.subCategory) product.subCategory = req.body.subCategory;
  // if (req.body.stock) product.stock = req.body.stock;
  if (req.body.status && req.body.status !== "")
    product.status = req.body.status;

  product = await product.save();
  if (req.body.options && req.body.options.length > 0) {
    await Option.deleteMany({ productId: product._id,storeId:req.body.storeId });
    const optionsData = req.body.options.map((option: any) => ({
      productId: product._id, // Link the option to the new product
      title: option.title,
      mass:option.mass,
      stock:option.stock,
      price:option.price,
      storeId:req.body.storeId
    }));

    // Save options
    await Option.insertMany(optionsData);
  }
  const options = await Option.find({ productId: product._id,storeId: req.body.storeId });
  res.status(200).json({ message: "Product updated successfully.", product,options });
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let product: any = await Product.findOne({
    _id: req.body.id,
    storeId: req.body.storeId
  });
  if (!product) return res.status(404).json({ message: "No record found." });

  res.status(200).json({
    data: product,
  });
};

export const changeStatus = async (req: Request, res: Response) => {
  const { error } = validateStatus(req.body);
  if (error) throw error;

  let product: any = await Product.findOne({ _id: req.body.id,storeId: req.body.storeId });
  if (!product) return res.status(400).json({ message: "No record found." });

  product.status = req.body.status;
  product = await product.save();

  res.status(200).json({ message: "Status changed successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
  // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });

  await Product.deleteOne({ _id: req.body.id,storeId: req.body.storeId });
  await Option.deleteMany({productId:req.body.id,storeId: req.body.storeId})

  res.status(200).json({ message: "Product deleted successfully." });
};

export const uploadImage = async (req: Request, res: Response) => {
  try{
  await fileUpload(req, res, async (err: any) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.body.filename)
      return res.status(400).json({ message: "Please select the file." });

    res.status(200).json({
      message: "File uploaded successfully.",
      data: {
        filename: req.body.filename,
      },
    });
  });
}
catch(error)
{
  res.status(200).json({
    message: error
    
  });
}
};

// export const deleteImage = async (req: Request, res: Response) => {
//     if (!req.body.filename || req.body.filename === '') return res.status(400).json({ message: "File is not selected." });

//     await fileDelete(req.body.filename);
//     res.status(200).json({ message: "File deleted successfully." });

// };
