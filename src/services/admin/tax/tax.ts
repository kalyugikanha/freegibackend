import { Request, Response } from "express";
import {
  Tax,
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
    let totalRecords: number = await Tax.find({
      // storeId:req.body?.storeId
    }).countDocuments();
    result.totalRecords = totalRecords;
  }

  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  result.tax = await Tax.find({
    $and: [filter],
    // storeId:req.body?.storeId
  })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let categoryRecord: number = result.tax.length;
  result.lastPage = categoryRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  // let tax: any = await Tax.findOne({ name: req.body.name,  });
  // if (tax)
  //   return res.status(400).json({ error: { name: "Name is already exists." } });

  let newTax: any = new Tax(
    _.pick(req.body, ["name", "percentage", "description","storeId"])
  );
  newTax = await newTax.save();

  res.status(200).json({ message: "Tax added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let taxName: any = await Tax.findOne({
    name: req.body.name,
    _id: { $ne: req.body.id },
  });
  if (taxName)
    return res.status(400).json({ error: { name: "Name is already exists." } });

  let tax: any = await Tax.findOne({ _id: req.body.id });
  if (!tax) return res.status(400).json({ message: "No record found." });

  if (req.body.name) tax.name = req.body.name;
  if (req.body.percentage) tax.percentage = req.body.percentage;
  if (req.body.description) tax.description = req.body.description;

  tax = await tax.save();

  res.status(200).json({ message: "Tax updated successfully." });
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let tax: any = await Tax.findOne({
    _id: req.body.id,
    storeId:req.body?.storeId
  });
  if (!tax) return res.status(404).json({ message: "No record found." });

  res.status(200).json({
    data: tax,
  });
};

export const changeStatus = async (req: Request, res: Response) => {
  const { error } = validateStatus(req.body);
  if (error) throw error;

  let tax: any = await Tax.findOne({ _id: req.body.id });
  if (!tax) return res.status(400).json({ message: "No record found." });

  tax.status = req.body.status;
  tax = await tax.save();

  res.status(200).json({ message: "Status changed successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
  // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });

  await Tax.deleteOne({ _id: req.body.id });

  res.status(200).json({ message: "Tax deleted successfully." });
};
