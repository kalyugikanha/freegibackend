import { Request, Response } from "express";
import { Users } from "./_validation";
import mongoose from "mongoose";

export const view = async (req: Request, res: Response) => {
  let users: any = await Users.findOne({ _id: req.body.cid }).select({
    password: 0,
    otp: 0,
  });
  if (!users) return res.status(400).json({ message: "No record found." });

  res.status(200).json({ data: users });
};


export const verify = async (req: Request, res: Response) => {
  let users: any = await Users.findOne({ _id: req.body.id });
  if (!users) return res.status(400).json({ message: "No record found." });

  if (users.isVerify) return res.status(400).json({ message: "Already verify." });

  await Users.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: { isVerify: true } });

  res.status(200).json({ message: "Verify successfully." });
};