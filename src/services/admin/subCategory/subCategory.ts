import { Request, Response } from "express";
import {
  SubCategory,
  Product,
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
    let totalRecords: number = await SubCategory.find({
      storeId:req.body?.storeId
    }).countDocuments();
    result.totalRecords = totalRecords;
  }

  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  result.subCategory = await SubCategory.find({
    $and: [filter],
    storeId:req.body?.storeId
  })
    .populate("category", { name: 1, image: 1, color: 1, icon: 1 })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

       for (let subCategory of result.subCategory) {
          const productCount = await Product.countDocuments({ subCategory: subCategory._id,  storeId:req.body?.storeId });
          subCategory.productCount = productCount||0
        }

  let subCategoryRecord: number = result.subCategory.length;
  result.lastPage = subCategoryRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const categoryViseList = async (req: Request, res: Response) => {
  const subCategory = await SubCategory.find({
    category: req.body.category,
    storeId:req.body?.storeId
  })
    .populate("category", { name: 1, image: 1, color: 1, icon: 1 })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: subCategory });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let category: any = await SubCategory.findOne({ name: req.body.name, storeId:req.body?.storeId });
  if (category)
    return res.status(400).json({ error: { name: "Name is already exists." } });

  let newCategory: any = new SubCategory(
    _.pick(req.body, ["name", "category", "icon","storeId"])
  );
  newCategory = await newCategory.save();

  res.status(200).json({ message: "Sub Category added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let subCategoryName: any = await SubCategory.findOne({
    name: req.body.name,
    _id: { $ne: req.body.id },
    storeId:req.body?.storeId
  });
  if (subCategoryName)
    return res.status(400).json({ error: { name: "Name is already exists." } });

  let category: any = await SubCategory.findOne({ _id: req.body.id,  storeId:req.body?.storeId });
  if (!category) return res.status(400).json({ message: "No record found." });

  category.name = req.body.name;
  if (req.body.category) category.category = req.body.category;
  if (req.body.icon) category.icon = req.body.icon;
  if (req.body.status && req.body.status !== "")
    category.status = req.body.status;

  category = await category.save();

  res.status(200).json({ message: "Sub Category updated successfully." });
};

export const changeStatus = async (req: Request, res: Response) => {
  const { error } = validateStatus(req.body);
  if (error) throw error;

  let category: any = await SubCategory.findOne({ _id: req.body.id,  storeId:req.body?.storeId });
  if (!category) return res.status(400).json({ message: "No record found." });

  category.status = req.body.status;
  category = await category.save();

  res.status(200).json({ message: "Status changed successfully." });
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let category: any = await SubCategory.findOne({
    _id: req.body.id,
    storeId:req.body?.storeId
  }).populate("category", { name: 1, image: 1, color: 1, icon: 1 });
  if (!category) return res.status(404).json({ message: "No record found." });

  res.status(200).json({
    data: category,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
  // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });

  await SubCategory.deleteOne({ _id: req.body.id,  storeId:req.body?.storeId });

  res.status(200).json({ message: "Category deleted successfully." });
};
