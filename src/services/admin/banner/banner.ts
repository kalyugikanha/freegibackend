import { Request, Response } from "express";
import {
  Banner,
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
    let totalRecords: number = await Banner.find().countDocuments();
    result.totalRecords = totalRecords;
  }

  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  result.banner = await Banner.find({
    $and: [filter],
  })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let categoryRecord: number = result.banner.length;
  result.lastPage = categoryRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let category: any = await Banner.findOne({ name: req.body.name });
  if (category)
    return res.status(400).json({ error: { name: "Name is already exists." } });

  let newCategory: any = new Banner(
    _.pick(req.body, ["name", "image", "description"])
  );
  newCategory = await newCategory.save();

  res.status(200).json({ message: "Banner added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let banner: any = await Banner.findOne({ _id: req.body.id });
  if (!banner) return res.status(400).json({ message: "No record found." });

  if (req.body.name) banner.name = req.body.name;
  if (req.body.image) banner.image = req.body.image;
  if (req.body.description) banner.description = req.body.description;
  if (req.body.status && req.body.status !== "")
    banner.status = req.body.status;

  banner = await banner.save();

  res.status(200).json({ message: "Banner updated successfully." });
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let category: any = await Banner.findOne({
    _id: req.body.id,
  });
  if (!category) return res.status(404).json({ message: "No record found." });

  res.status(200).json({
    data: category,
  });
};

export const changeStatus = async (req: Request, res: Response) => {
  const { error } = validateStatus(req.body);
  if (error) throw error;

  let category: any = await Banner.findOne({ _id: req.body.id });
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

  await Banner.deleteOne({ _id: req.body.id });

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
