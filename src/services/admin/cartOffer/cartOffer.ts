import { Request, Response } from "express";
import {
  validateAdd,
  validateUpdate,
  CartOffer,
} from "./_validation";
import * as _ from "lodash";
import {errorHandler} from "../../../helper/erroHandle";


export const list = errorHandler(async (req: Request, res: Response) => {
 
  const product = await CartOffer.find({ storeId:req.body?.storeId}).populate({
    path: "products.productId",
    model: "product",
  }).populate({
    path: "products.optionId",
    model: "option", 
  }).populate({
    path: "freeGiftId",
    model: "freeProduct", 

  }).sort({
    _id: -1,
  })

  res.status(200).json({ data: product });
})

export const add = errorHandler(async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  // Check if product name already exists
  const existingProduct = await CartOffer.findOne({ name: req.body.name,storeId:req.body.storeId });
  if (existingProduct)
      return res.status(400).json({ error: { name: "Name already exists." } });

  // Validate products array
  if (req.body.products && req.body.products.length > 0) {
      const invalidProduct = req.body.products.some((p: any) => !p.productId || !p.optionId);
      if (invalidProduct) {
          return res.status(400).json({ error: "Each product must have both productId and optionId." });
      }
  } else if (!req.body.freeGiftId) {
      return res.status(400).json({ error: "Either products array or freeGiftId is required." });
  }

  // Create new CartOffer entry
  const newCartOffer = new CartOffer(
      _.pick(req.body, ["name", "minPrice", "maxPrice", "freeGiftId", "products", "isFreeDeliver","storeId"])
  );

  await newCartOffer.save();

  return res.status(201).json({ message: "Cart offer added successfully.", data: newCartOffer });
});

export const update = errorHandler(async (req: Request, res: Response) => {
     const { error } = validateUpdate(req.body);
    if (error)
      return res.status(400).json({ error: error.details.map((err) => err.message) });
  const { name, freeGiftId,products, minPrice, maxPrice, isFreeDeliver } = req.body;
  const { id } = req.params;

  const existingOffer = await CartOffer.findOne({ name, _id: { $ne: id },storeId:req.body.storeId });
  if (existingOffer)
    return res.status(400).json({ error: { name: "Name already exists." } });
  let updateFields: any = {};
  if (name) updateFields.name = name;
  if (minPrice !== undefined) updateFields.minPrice = minPrice;
  if (maxPrice !== undefined) updateFields.maxPrice = maxPrice;
  if (isFreeDeliver !== undefined) updateFields.isFreeDeliver = isFreeDeliver;

  

  if (products) updateFields.products = products;
  if (freeGiftId) updateFields.freeGiftId = freeGiftId;

  const updatedOffer = await CartOffer.findByIdAndUpdate(id, { $set: updateFields }, { 
    new: true, 
    runValidators: true 
  });


  if (!updatedOffer) throw new Error('"Cart offer not found')

  res.status(200).json({ message: "Cart offer updated successfully.", offer: updatedOffer });
});

export const view = errorHandler(async (req: Request, res: Response) => {
const product = await CartOffer.findOne({
  storeId:req.body.storeId
}).populate({
  path: "products.productId",
  model: "product",
}).populate({
  path: "products.optionId",
  model: "option", 

}).populate({
  path: "freeGiftId",
  model: "freeProduct", 

}).sort({
  _id: -1,
}).lean();


  res.status(200).json({
    data: product||{},
  });
})

// export const changeStatus = async (req: Request, res: Response) => {
//   const { error } = validateStatus(req.body);
//   if (error) throw error;

//   let product: any = await CartOffer.findOne({ _id: req.body.id });
//   if (!product) return res.status(400).json({ message: "No record found." });

//   product.status = req.body.status;
//   product = await CartOffer.save();

//   res.status(200).json({ message: "Status changed successfully." });
// };

export const remove = errorHandler(async (req: Request, res: Response) => {

  let id=req.params.id
  let check: any = await CartOffer.findOne({ _id:id,storeId:req.body.storeId });
  if(!check){
    throw new Error("No record found.")
  }
  await CartOffer.deleteOne({ _id:id });

  res.status(200).json({ message: "Product deleted successfully." });

})

// export const uploadImage = async (req: Request, res: Response) => {
//   try{
//   await fileUpload(req, res, async (err: any) => {
//     if (err) return res.status(400).json({ message: err.message });
//     if (!req.body.filename)
//       return res.status(400).json({ message: "Please select the file." });

//     res.status(200).json({
//       message: "File uploaded successfully.",
//       data: {
//         filename: req.body.filename,
//       },
//     });
//   });
// }
// catch(error)
// {
//   res.status(200).json({
//     message: error
    
//   });
// }
// };
