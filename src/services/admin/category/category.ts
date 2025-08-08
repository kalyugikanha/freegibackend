import { Request, Response } from "express";
import {
  Category,
  Product,
  validateAdd,
  validateUpdate,
  validateStatus,
  validateDelete,
} from "./_validation";
import _ from "lodash";
import { fileUpload } from "../../../helper/upload";


export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 100;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Category.find({
      storeId:req.body?.storeId
    }).countDocuments();
    result.totalRecords = totalRecords;
  }

  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  

  result.category = await Category.find({
    $and: [filter],
    storeId:req.body?.storeId
  })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    for (let category of result.category) {
      const productCount = await Product.countDocuments({ category: category._id ,storeId:req.body?.storeId});
      category.productCount = productCount||0
    }

  let categoryRecord: number = result.category.length;
  result.lastPage = categoryRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  console.log(req.body)
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let category: any = await Category.findOne({ name: req.body.name, storeId: req.body.storeId});
  if (category)
    return res.status(400).json({ error: { name: "Name is already exists." } });

  let newCategory: any = new Category(
    _.pick(req.body, ["name", "image", "icon", "color",'storeId'])
  );
  newCategory = await newCategory.save();

  res.status(200).json({ message: "Category added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let categoryName: any = await Category.findOne({
    name: req.body.name,
    _id: { $ne: req.body.id },
    storeId: req.body.storeId,
  });
  
  if (categoryName)
    return res.status(400).json({ error: { name: "Name is already exists." } });

  let category: any = await Category.findOne({ _id: req.body.id, storeId: req.body.storeId});
  if (!category) return res.status(400).json({ message: "No record found." });

  category.name = req.body.name;
  if (req.body.image) category.image = req.body.image;
  if (req.body.icon) category.icon = req.body.icon;
  if (req.body.color) category.color = req.body.color;
  if (req.body.status && req.body.status !== "")
    category.status = req.body.status;

  category = await category.save();

  res.status(200).json({ message: "Category updated successfully." });
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let category: any = await Category.findOne({
    _id: req.body.id,
    storeId: req.body.storeId,
  });
  if (!category) return res.status(404).json({ message: "No record found." });

  res.status(200).json({
    data: category,
  });
};

export const changeStatus = async (req: Request, res: Response) => {
  const { error } = validateStatus(req.body);
  if (error) throw error;

  let category: any = await Category.findOne({ _id: req.body.id, storeId: req.body.storeId});
  if (!category) return res.status(400).json({ message: "No record found." });

  category.status = req.body.status;
  category = await category.save();

  res.status(200).json({ message: "Status changed successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
  // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });

  await Category.deleteOne({ _id: req.body.id ,storeId:req.body.storeId});

  res.status(200).json({ message: "Category deleted successfully." });
};

export const uploadImage = async (req: Request, res: Response) => {
  await fileUpload(req, res, async (err: any) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.body.filename)
      return res.status(400).json({ message: "Please select the file." });

    res.status(200).json({
      message: "File uploaded successfully.",
      data: {
        filename: req.body.filename,
      },
    });
  });
};

// export const deleteImage = async (req: Request, res: Response) => {
//     if (!req.body.filename || req.body.filename === '') return res.status(400).json({ message: "File is not selected." });

//     await fileDelete(req.body.filename);
//     res.status(200).json({ message: "File deleted successfully." });

// };
