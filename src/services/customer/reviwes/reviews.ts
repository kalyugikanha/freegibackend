import { Request, Response } from "express";
import { Reviews } from "./_validation";
import _ from "lodash";
import mongoose from "mongoose";

export const list = async (req: Request, res: Response) => {
  
  const mostReviewedItems = await Reviews.aggregate([
     { $match: {
         storeId:new mongoose.Types.ObjectId(req.body.storeId), // Filter by storeId
      }
    },
    {
      $group: {
        _id: "$productId", // Group by productId
        reviewCount: { $sum: 1 }, // Count the number of reviews
      },
    },
    {
      $sort: { reviewCount: -1 }, // Sort by review count in descending order
    },
    {
      $lookup: {
        from: "product", // The collection to join
        localField: "_id", // productId from reviews
        foreignField: "_id", // _id in products
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails", // Unwind the productDetails array
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        reviewCount: 1,
        productName: "$productDetails.name",
        price: "$productDetails.price",
        description: "$productDetails.description",
        image: "$productDetails.image",
      },
    },
  ]);

  res.status(200).json({ data: mostReviewedItems });
};

export const add = async (req: Request, res: Response) => {
  if (!req.body.productId || !req.body.rating) {
    return res
      .status(400)
      .json({ message: "productId and rating are required." });
  }

  if (req.body.rating < 1 || req.body.rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }
  let newReview: any = new Reviews(
    _.pick(req.body, ["productId", "rating", "comment,","storeId"])
  );
  newReview.userId = req.body.cid;
  newReview = await newReview.save();

  res.status(200).json({ message: "Review added successfully." });
};