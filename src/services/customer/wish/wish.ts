import { Request, Response } from "express";
import { wish, validateList, validate } from "./_validation";
import mongoose from "mongoose";
import { model } from "mongoose";
import { optionSchema } from "../../../models/option";
import { cartSchema } from "../../../models/cart";
export const Option = model("option", optionSchema);
export const Cart = model("Cart", cartSchema);

export const add = async (req: Request, res: Response) => {
    const { error } = validate(req.body);
    if (error) throw error;

    const wishDetail = await wish.findOne({ userId: new mongoose.Types.ObjectId(req.body.userId),storeId:req.body.storeId });
    if (wishDetail) {
        await wish.findByIdAndUpdate({ _id: wishDetail._id }, { $push: { productId: req.body.productId } }, { $set: { updatedAt: new Date().toISOString() } });
    }
    else {
        let newWisht: any = new wish();
        newWisht.userId = req.body.userId;
        newWisht.storeId = req.body.storeId;
        newWisht.productId = [req.body.productId];
        newWisht.createdAt = new Date().toISOString();
        newWisht.updatedAt = new Date().toISOString();
        newWisht = await newWisht.save();
    }

    res.status(200).json({ message: "Added successfully." });
}

export const list = async (req: Request, res: Response) => {
    const { error } = validateList(req.body);
    if (error) throw error;
let userId = req.body.userId;
    const list = await wish.aggregate([{
        $match: {
            userId: new mongoose.Types.ObjectId(req.body.userId),
            storeId: new mongoose.Types.ObjectId(req.body.storeId)
        }
    },
    {
        $unwind: {
            "path": "$productId",
            "preserveNullAndEmptyArrays": true
        }
    },
    {
        $lookup: {
            from: "product",
            let: { id: "$productId" },
            pipeline: [{
                $match: {
                    $expr: { $eq: ["$_id", "$$id"] }
                }
            }],
            as: "productDetail"
        }
    },
    {
        $unwind: "$productDetail"
    },
    {
        $lookup: {
            from: "reviews",
            let: { id: "$productDetail._id" },
            pipeline: [{
                $match: {
                    $expr: { $eq: ["$productId", "$$id"] }
                }
            }],
            as: "reviews"
        }
    },
    {
        $addFields: {
            rating: {
                $round: [{
                    $multiply: [{
                        $divide: [{
                            $sum: "$reviews.rating"
                        },
                        {
                            $multiply: [5, {
                                $cond: {
                                    if: {
                                        $eq: [{
                                            $size: "$reviews"
                                        }, 0]
                                    },
                                    then: 1,
                                    else: {
                                        $size: "$reviews"
                                    }
                                }
                            }]
                        }]
                    }, 5]
                }, 1]
            }
        }
    }]);
      const cart = userId ? await Cart.findOne({ userId: userId,storeId:req.body.storeId }) : null; 
    
     const productsWithOptionCount = await Promise.all(
        list.map(async (item: any) => {
          const product = item.productDetail;
    
          const options = await Option.find({ productId: product._id,storeId:req.body.storeId });
    
          const optionStockSum = await Option.aggregate([
            { $match: { productId: product._id,storeId: new mongoose.Types.ObjectId(req.body.storeId) } },
            { $group: { _id: null, totalStock: { $sum: "$stock" } } },
          ]);
    
          const productStockCount =optionStockSum.length > 0 ? optionStockSum[0].totalStock : 0;
    
          product.stock = productStockCount;
          product.totalCartQuantity = 0; 
    
          product.options = options.map((option: any) => {
            option = option.toObject();
      
            const cartProductOptionQty = userId
              ? cart?.products.find(
                  (item: any) =>
                    item.productId.toString() === product._id.toString() &&
                    item.optionId.toString() === option._id.toString()
                )
              : null;
      
            option.cartOptionQty = cartProductOptionQty
              ? cartProductOptionQty.quantity
              : 0;
      
            if (userId) {
              product.totalCartQuantity += option.cartOptionQty;
            }
      
            return option;
          });
      
          return product;
        })
      );

    res.status(200).json({ message: "Wish detail successfully.", data: productsWithOptionCount });
}

export const remove = async (req: Request, res: Response) => {
    const { error } = validate(req.body);
    if (error) throw error;

    const wishDetail = await wish.findOne({ userId: new mongoose.Types.ObjectId(req.body.userId),storeId:req.body.storeId });
    if (wishDetail) {
        await wish.findByIdAndUpdate({ _id: wishDetail._id }, { $pull: { productId: new mongoose.Types.ObjectId(req.body.productId) } }, { $set: { updatedAt: new Date().toISOString() } });
        res.status(200).json({ message: "Removed successfully." });
    }
    else {
        return res.status(400).json({ message: "No record found." });
    }
}
