import { Request, Response } from "express";
import {
    featureditem,
    Product,
    validate,
    validateRemove,
} from "./_validation";
import _ from "lodash";
import mongoose, { model } from "mongoose";
import { optionSchema } from "../../../models/option";
export const Option = model("option", optionSchema);

export const list = async (req: Request, res: Response) => {
    try {
            const data = await featureditem.aggregate([{
                 $match: { storeId:  new mongoose.Types.ObjectId(req.body.storeId) }, 
              }
              ,{
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
            }]);

           const productsWithOptionCount = await Promise.all(
            data.map(async (item: any) => {
               const product = item.productDetail;
       
               // Fetch product options
               const options = await Option.find({ productId: product._id , storeId: req.body.storeId});
       
               // Calculate total stock for options
               const optionStockSum = await Option.aggregate([
                 { $match: { productId: product._id, storeId:  new mongoose.Types.ObjectId(req.body.storeId) } },
                 { $group: { _id: null, totalStock: { $sum: "$stock" } } }
               ]);
       
               const productStockCount = optionStockSum.length > 0 ? optionStockSum[0].totalStock : 0;
       
               product.stock = productStockCount; 
               product.options = options; 
               return item;
             })
           );

        res.status(200).json({ message: "Successfully fetched.", data:productsWithOptionCount});
    } catch (error) {
        console.error("Error fetching featured items:", error);
        res.status(400).json({ message: "Internal Server Error" });
    }
};


export const add = async (req: Request, res: Response) => {
    const { error } = validate(req.body);
    if (error) throw error;

    if (req.body.productIds.length == 0) return res.status(400).json({ error: { name: "please select product ids." } });
    const productIds = req.body.productIds.map((id: string) => new mongoose.Types.ObjectId(id));
   

  

    const foundProducts = await Product.find({
        _id: { $in: productIds },
        storeId: req.body.storeId,
    });

    const foundProductIds = foundProducts.map((product) => product._id.toString());

    const missingProductIds = req.body.productIds.filter((id: string) => !foundProductIds.includes(id));

    if (missingProductIds.length > 0) {
        return res.status(404).json({
            error: {
                name: "Some products not found.",
                missingProductIds: missingProductIds,
            },
        });
    }
    for (let index = 0; index < req.body.productIds.length; index++) {
        const element = req.body.productIds[index];
        
        let featureditemData: any = await featureditem.findOne({ productId: element,storeId: req.body.storeId, });
        if (featureditemData) return res.status(400).json({ error: { name: "Product is already exists." } });

        let newFeatureditem: any = new featureditem();
        newFeatureditem.productId = element;
        newFeatureditem.storeId=req.body.storeId
        newFeatureditem = await newFeatureditem.save();
    }

    res.status(200).json({ message: "Product added successfully." });
};

export const remove = async (req: Request, res: Response) => {
    const { error } = validateRemove(req.body);
    if (error) throw error;;

    await featureditem.deleteOne({ _id: req.body.id,storeId: req.body.storeId, });

    res.status(200).json({ message: "Product deleted successfully." });
};