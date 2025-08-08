import { Request, Response } from "express";
import { Users, Address, validateUpdate } from "./_validation";
import mongoose from "mongoose";


export const view = async (req: Request, res: Response) => {
  // let users: any = await Users.findOne({ _id: req.body.cid }).select({
  //   password: 0,
  //   otp: 0,
  // });

  let users: any = await Users.findOne({ _id: new mongoose.Types.ObjectId(req.body.cid) });
  if (!users) return res.status(400).json({ message: "No record found." });

  let address = await Address.findOne({ userId: users._id, default: true });

  res.status(200).json({ data: users, address: address });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let user: any = await Users.findOne({ _id: req.body.id });
  if (!user) return res.status(400).json({ message: "No record found." });

  if (req.body.firstName) user.firstName = req.body.firstName;
  if (req.body.lastName) user.lastName = req.body.lastName;
  if (req.body.email) user.email = req.body.email;
  if (req.body.mobileNumber) user.mobileNumber = req.body.mobileNumber;
  if (req.body.gender) user.gender = req.body.gender;
  if (req.body.dob) user.dob = req.body.dob;
  if (req.body.profilePic) user.profilePic = req.body.profilePic;

  user = await user.save();

  res.status(200).json({ message: "User updated successfully." });
}

export const logout = async (req: Request, res: Response) => {
  
}