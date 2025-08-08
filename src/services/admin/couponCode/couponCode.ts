import { Request, Response } from "express";
import {
  CouponCode,
  validateAdd,
  validateUpdate,
  validateStatus,
  validateDelete,
} from "./_validation";
import _ from "lodash";

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 100;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await CouponCode.find({storeId: req.body.storeId}).countDocuments();
    result.totalRecords = totalRecords;
  }

  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  result.couponCode = await CouponCode.find({
    $and: [filter],
    storeId: req.body.storeId
  })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let categoryRecord: number = result.couponCode.length;
  result.lastPage = categoryRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let couponCode: any = await CouponCode.findOne({ name: req.body.name, storeId: req.body.storeId});
  if (couponCode)
    return res.status(400).json({ error: { name: "Name is already exists." } });

  const schemaKeys = [
    "name",
    "code",
    "type",
    "minPrice",
    "maxPrice",
    "endDate",
    "limit",
    "discount",
    "status",
    "createdAt",
    "updatedAt",
    "storeId"
  ];
  
  let newCouponCode: any = new CouponCode(_.pick(req.body, schemaKeys));
  newCouponCode = await newCouponCode.save();

  res.status(200).json({ message: "Coupon code added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  const { id, name, code, type, minPrice, maxPrice, endDate, limit, discount, status } = req.body;

  // Check if name already exists with a different ID
  const existingCoupon = await CouponCode.findOne({ name, _id: { $ne: id },storeId: req.body.storeId })
  if (existingCoupon) {
    return res.status(400).json({ error: { name: "Name already exists." } });
  }

  let couponCode = await CouponCode.findOne({
    _id:id,
    storeId: req.body.storeId
  });
  if (!couponCode) {
    return res.status(404).json({ message: "No record found." });
  }

  const updatedFields: any = {};
  if (name) updatedFields.name = name;
  if (code) updatedFields.code = code;
  if (type) updatedFields.type = type;
  if (minPrice !== undefined) updatedFields.minPrice = minPrice;
  if (maxPrice !== undefined) updatedFields.maxPrice = maxPrice;
  if (endDate) updatedFields.endDate = endDate;
  if (limit !== undefined) updatedFields.limit = limit;
  if (discount !== undefined) updatedFields.discount = discount;
  if (status) updatedFields.status = status;
  updatedFields.updatedAt = new Date();

  couponCode = await CouponCode.findByIdAndUpdate(id, { $set: updatedFields }, { new: true, runValidators: true });

  res.status(200).json({ message: "Coupon code updated successfully.", couponCode });
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let couponCode: any = await CouponCode.findOne({
    _id: req.body.id,
    storeId: req.body.storeId
  });
  if (!couponCode) return res.status(404).json({ message: "No record found." });

  res.status(200).json({
    data: couponCode,
  });
};

export const changeStatus = async (req: Request, res: Response) => {
  const { error } = validateStatus(req.body);
  if (error) throw error;

  let couponCode: any = await CouponCode.findOne({ _id: req.body.id,storeId: req.body.storeId });
  if (!couponCode) return res.status(400).json({ message: "No record found." });

  couponCode.status = req.body.status;
  couponCode = await couponCode.save();

  res.status(200).json({ message: "Status changed successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
  // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });

  await CouponCode.deleteOne({ _id: req.body.id ,storeId: req.body.storeId});

  res.status(200).json({ message: "Coupon code deleted successfully." });
};
