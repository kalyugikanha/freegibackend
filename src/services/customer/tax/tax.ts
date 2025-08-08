import { Request, Response } from "express";
import { Tax } from "./_validation";

export const list = async (req: Request, res: Response) => {
  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  const tax = await Tax.find({
    $and: [filter],
    storeId: req.body.storeId
  })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: tax });
};
