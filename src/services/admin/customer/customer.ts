import { Request, Response } from "express";
import {
  validateAdd,
  validateUpdate,
  // validateStatus,
  validateDelete,
  Users,
} from "./_validation";
import _ from "lodash";
// import { fileUpload } from "../../../helper/upload";
import { encrypt } from "../../../helper/encription";

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 100;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Users.find({
      storeId: req.body.storeId,
      role: "Customer"
    }).countDocuments();
    result.totalRecords = totalRecords;
  }

  // let filter: any = new Object();
  let filter: any = { role: "Customer" }; // Include filter for customers
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  result.users = await Users.find({
    $and: [filter],
    storeId: req.body.storeId
  })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let usersRecord: number = result.users.length;
  result.lastPage = usersRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let users: any = await Users.findOne({ email: req.body.email,storeId: req.body.storeId });
  if (users)
    return res.status(400).json({ message: "Email is already exists." });

  let newUser: any = new Users(
    _.pick(req.body, ["firstName", "lastName", "email",'storeId'])
  );
  newUser.password = encrypt(req.body.password);
  newUser.role = "Customer";
  newUser = await newUser.save();

  res.status(200).json({ message: "User added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  if (req.body.email) {
    let usersEmail: any = await Users.findOne({
      email: req.body.email,
      _id: { $ne: req.body.id },
      storeId: req.body.storeId
    });
    if (usersEmail)
      return res.status(400).json({ message: "Email is already exists." });
  }

  let user: any = await Users.findOne({ _id: req.body.id,storeId: req.body.storeId });
  if (!user) return res.status(400).json({ message: "No record found." });

  if (req.body.email) user.email = req.body.email;
  if (req.body.firstName) user.firstName = req.body.firstName;
  if (req.body.lastName) user.lastName = req.body.lastName;

  user = await user.save();

  res.status(200).json({ message: "User updated successfully." });
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let user: any = await Users.findOne({
    _id: req.body.id,
    storeId: req.body.storeId
  });
  if (!user) return res.status(404).json({ message: "No record found." });

  res.status(200).json({
    data: user,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
  // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });

  await Users.deleteOne({ _id: req.body.id, storeId: req.body.storeId });

  res.status(200).json({ message: "User deleted successfully." });
};
