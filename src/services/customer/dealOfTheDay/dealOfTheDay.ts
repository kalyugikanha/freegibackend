import { Request, Response } from "express";
import mongoose, { model } from "mongoose";
import { dealofthedaySchema } from "../../../models/dealoftheday";
import { productSchema } from "../../../models/product";

export const dealoftheday = model("dealoftheday", dealofthedaySchema);
export const Product = model("Product", productSchema);
import { optionSchema } from "../../../models/option";
import { cartSchema } from "../../../models/cart";
export const Option = model("option", optionSchema);
export const Cart = model("Cart", cartSchema);

export const list = async (req: Request, res: Response) => {
  let match: any = {
    $match: {
      storeId: new mongoose.Types.ObjectId(req.body.storeId)
    }
  };
    const userId = new mongoose.Types.ObjectId(req.body.userId);
  
  try {
    const data = await dealoftheday.aggregate([
      match,
      {
        $unwind: "$products", // Unwind the products array
      },
      {
        $lookup: {
          from: "product", // Collection name for products
          localField: "products.productId", // Match productId in products array with _id in product collection
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, // Unwind the productDetails array
      {
        $lookup: {
          from: "option", // Collection name for options
          localField: "products.optionId", // Match optionId in products array with _id in option collection
          foreignField: "_id",
          as: "optionDetails",
        },
      },
      { $unwind: "$optionDetails" }, // Unwind the optionDetails array
      {
        $group: {
          _id: "$_id", // Group by deal ID
          name: { $first: "$name" },
          price: { $first: "$price" },
          image: { $first: "$image" },
          description: { $first: "$description" },
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
    const cart = userId ? await Cart.findOne({ userId: userId,storeId:req.body.storeId }) : null;

    const dealsWithCartQuantity = data.map((deal: any) => {
      let cartDealQuantity = 0;

      if (userId && cart) {
        const cartDeal = cart.dealofthedayId.find(
          (item: any) => item.dealId.toString() === deal._id.toString()
        );
        if (cartDeal) {
          cartDealQuantity = cartDeal.quantity;
        }
      }

      return {
        ...deal,
        cartDealQuantity,
      };
    });
    res.status(200).json({ message: "Successfully fetched.", data:dealsWithCartQuantity });
  } catch (error) {
    console.error("Error fetching deal of the day list:", error);
    res.status(400).json({ error: "Internal Server Error" });
  }
};
