import { Request, Response } from "express";
import {
    dealoftheday,
    validate,
    Option,
    Product
} from "./_validation";
import _ from "lodash";
import mongoose from "mongoose";

export const list = async (req: Request, res: Response) => {
  try {
   
    const data = await dealoftheday.aggregate([
      {
        $match: { storeId:  new mongoose.Types.ObjectId(req.body.storeId) }, 
      },
      {
        $lookup: {
          from: "product", 
          localField: "products.productId", 
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "option", 
          localField: "products.optionId", 
          foreignField: "_id",
          as: "optionDetails",
        },
      },
      { $unwind: { path: "$optionDetails", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id", 
          name: { $first: "$name" },
          price: { $first: "$price" },
          image:{ $first: "$image" },
          description: { $first: "$description" },
          storeId: { $first: "$storeId" },
          products: {
            $push: {
              productId: "$products.productId",
              optionId: "$products.optionId",
              productDetails: "$productDetails",
              optionDetails: "$optionDetails",
            },
          },
        },
      },
    ]);

    res.status(200).json({ message: "Successfully fetched.", data });
  } catch (error) {
    console.error("Error fetching deal of the day list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const add = async (req: Request, res: Response) => {
  try {
    const { error } = validate(req.body);
    if (error) throw error;

    const { products, name, price, description ,image} = req.body;

    let existingDeal = await dealoftheday.findOne({ name, storeId: req.body.storeId });

    if (existingDeal) {
      return res.status(200).json({ error: { name: "Deal with this name already exists." } });
    }

    for (const product of products) {
      const { productId, optionId } = product;

      const productExists = await Product.findOne({
        _id: productId,
        storeId: req.body.storeId,
      });
      if (!productExists) {
        return res.status(400).json({ error: { message: `Product with ID ${productId} does not exist.` } });
      }

      const optionExists = await Option.findOne({
        _id: optionId,
        productId: productId,
        storeId: req.body.storeId,
      });
      if (!optionExists) {
        return res.status(400).json({ error: { message: `Option with ID ${optionId} does not exist.` } });
      }

      if (optionExists.productId.toString() !== productId) {
        return res.status(400).json({ error: { message: `Option with ID ${optionId} does not belong to Product with ID ${productId}.` } });
      }
    }

    const newDeal = new dealoftheday({
      name,
      image,
      price,
      description,
      products, 
      storeId: req.body.storeId,
    });

    await newDeal.save();

    res.status(200).json({ message: "New deal created successfully.", data: newDeal });
  } catch (error) {
    console.error("Error adding deal of the day:", error);
    res.status(400).json({ error: { name: "Internal server error." } });
  }
};
  


export const remove = async (req: Request, res: Response) => {
 let id = req.params.id;
 let checkout = await dealoftheday.findOne({
  _id: id,
  storeId: req.body.storeId,
 })
 if(!checkout){
  throw new Error("No record found.")
 }
    await dealoftheday.deleteOne({ _id: id , storeId: req.body.storeId});

    res.status(200).json({ message: "Product deleted successfully." });
};


export const update = async (req: Request, res: Response) => {
  try {
    const { name, price, description, products,image } = req.body;
    const id = req.params.id;

    let existingDeal = await dealoftheday.findOne({
      _id: id,
      storeId: req.body.storeId,
    });
    if (!existingDeal) {
      return res.status(404).json({ error: { name: "Deal not found." } });
    }

    if (name) {
      const nameExists = await dealoftheday.findOne({
        name,
        _id: { $ne: existingDeal._id },
        storeId: req.body.storeId,
      });

      if (nameExists) {
        return res.status(400).json({ error: { name: "Deal name already exists." } });
      }
      existingDeal.name = name;
    }

    if (products && Array.isArray(products)) {
      for (const product of products) {
        const { productId, optionId } = product;

        const productExists = await Product.findOne({
          _id: productId,
          storeId: req.body.storeId,
        });
        if (!productExists) {
          return res.status(400).json({ error: { message: `Product with ID ${productId} does not exist.` } });
        }

        const optionExists = await Option.findOne({
          _id: optionId,
          productId: productId,
          storeId: req.body.storeId,
        });
        if (!optionExists) {
          return res.status(400).json({ error: { message: `Option with ID ${optionId} does not exist.` } });
        }

        if (optionExists.productId.toString() !== productId) {
          return res.status(400).json({ error: { message: `Option with ID ${optionId} does not belong to Product with ID ${productId}.` } });
        }
      }

      existingDeal.products = products;
    }

    existingDeal.price = price ?? existingDeal.price;
    existingDeal.description = description ?? existingDeal.description;
    existingDeal.updatedAt = new Date();
    existingDeal.image = image?? existingDeal.image;
    existingDeal.updatedAt = new Date();
    existingDeal.storeId = req.body.storeId;

    await existingDeal.save();

    res.status(200).json({ message: "Deal updated successfully.", data: existingDeal });
  } catch (error) {
    console.error("Error updating deal:", error);
    res.status(400).json({ error: { name: "Internal Server Error." } });
  }
};

export const getDetails=async(req:Request,res:Response)=>{
  let id = req.params.id;
  let deal = await dealoftheday.findOne({
    _id: id,
    storeId: req.body.storeId,
  }).populate({
    path: "products.productId",
    model: "product",
  }).populate({
    path: "products.optionId",
    model: "option",
  })
 
  res.status(200).json({ message: "Deal fetched successfully.", data: deal });
}
