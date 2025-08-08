import { Request, Response } from "express";
import { SubCategory } from "./_validation";
import _ from "lodash";
import mongoose from "mongoose";

export const list = async (req: Request, res: Response) => {
  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  if (req.body.category && req.body.category != "") {
    filter["category"] = req.body.category;
  }

  const subCategory = await SubCategory.find({
    $and: [filter],
    storeId: new mongoose.Types.ObjectId(req.body.storeId)
  })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: subCategory });
};
