import { Request, Response } from "express";
import { Category } from "./_validation";
import mongoose from "mongoose";

export const list = async (req: Request, res: Response) => {
  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
    
  }

  // const category = await Category.find({
  //   $and: [filter],
  // })
  //   .sort({ _id: -1 })
  //   .lean();

  const category = await Category.aggregate([{
    $match: {
      $and: [filter],
      storeId: new mongoose.Types.ObjectId(req.body.storeId),
    },
   
  },
  {
    $lookup: {
      from: "subCategory",
      let: { id: "$_id" },
      pipeline: [{
        $match: {
          $expr: { $eq: ["$category", "$$id"] },
          status: "enable"
        }
      },
      {
        $project: {
          name: 1
        }
      }],
      as: "subCategory"
    }
  },
  {
    $sort: {
      _id: -1
    }
  }])

  res.status(200).json({ data: category });
};
