import { Request, Response } from "express";
import { Order } from "./_validation";
import _ from "lodash";

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 100;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Order.find({
      storeId: req.body.storeId
    }).countDocuments();
    result.totalRecords = totalRecords;
  }

  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  result.order = await Order.find({
    $and: [filter],
    storeId: req.body.storeId
  })
    .populate("products.productId", {
      name: 1,
      price: 1,
      image: 1,
      description: 1,
    })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let categoryRecord: number = result.order.length;
  result.lastPage = categoryRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};
export const updateStatus = async (req: Request, res: Response) => {
  let check= await Order.findOne(
    { _id: req.body.orderId,storeId: req.body.storeId },
  )
  if(!check) return res.status(404).json({ message: "No record found." });
   await Order.updateOne(
    { _id: req.body.orderId },
    { $set: { status: req.body.status ,notes:req.body.notes} }
  );
  let orderData= await Order.findOne(
    { _id: req.body.orderId,storeId: req.body.storeId },
  )


  res.status(200).json({ message: "Order status updated successfully",data:orderData });
}
