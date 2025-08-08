import { Request, Response } from "express";
import {
  validateAdd,
  validateUpdate,
  FreeProduct,
} from "./_validation";
import _ from "lodash";
import { fileUpload } from "../../../helper/upload";


export const list = async (req: Request, res: Response) => {
 

  const product = await FreeProduct.find({
    storeId: req.body.storeId
  })
    .sort({ _id: -1 })
    .lean();


     
  res.status(200).json({ data: product });
};

export const add = async (req: Request, res: Response) => {
  try{
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let product: any = await FreeProduct.findOne({ name: req.body.name ,storeId: req.body.storeId});
  if (product)return res.status(400).json({ error: { name: "Name is already exists." } });

  let newFreeProduct: any = new FreeProduct(
    _.pick(req.body, [
      "name",
      "image",
      "price",
      "stock",
      "storeId",
    ])
  );
  newFreeProduct = await newFreeProduct.save();
  
  res.status(200).json({ message: "Product added successfully.",data:newFreeProduct });
}catch(err){
  console.log(err);
  res.status(400).json({
    message:err,
  })
  
}
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let productName: any = await FreeProduct.findOne({
    name: req.body.name,
    _id: { $ne: req.params.id },
    storeId: req.body.storeId
  });
  if (productName)
    return res.status(400).json({ error: { name: "Name is already exists." } });

  let product: any = await FreeProduct.findOne({ _id: req.params.id ,storeId: req.body.storeId});
  if (!product) {return res.status(400).json({ message: "No record found." });}

  product.name = req.body.name;
  if (req.body.image) product.image = req.body.image;
  if (req.body.price) product.price = req.body.price;
  if (req.body.stock) product.stock = req.body.stock;
 

  product = await product.save();
 
    
  res.status(200).json({ message: "Product updated successfully.", product, });
};

export const view = async (req: Request, res: Response) => {


  let product: any = await FreeProduct.findOne({
    _id: req.params.id,
    storeId: req.body.storeId
  });
  if (!product) return res.status(404).json({ message: "No record found." });

  res.status(200).json({
    data: product,
  });
};

// export const changeStatus = async (req: Request, res: Response) => {
//   const { error } = validateStatus(req.body);
//   if (error) throw error;

//   let product: any = await FreeProduct.findOne({ _id: req.body.id });
//   if (!product) return res.status(400).json({ message: "No record found." });

//   product.status = req.body.status;
//   product = await FreeProduct.save();

//   res.status(200).json({ message: "Status changed successfully." });
// };

export const remove = async (req: Request, res: Response) => {
  try{

  let id=req.params.id
  let check: any = await FreeProduct.findOne({ _id:id ,storeId: req.body.storeId});
  if(!check){
    throw new Error("No record found.")
  }
  await FreeProduct.deleteOne({ _id:id });

  res.status(200).json({ message: "Product deleted successfully." });
}catch(err){
  res.status(400).json({
    message:err,
  })
}
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