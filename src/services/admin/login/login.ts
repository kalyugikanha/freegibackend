import { Request, Response } from "express";
import { Users, validateLogin, validateSignup } from "./_validation";
import _ from "lodash";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const signup = async (req: Request, res: Response) => {
  const { error } = validateSignup(req.body);
  if (error) throw error;

  let users: any = await Users.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (users)
    return res
      .status(400)
      .json({ error: { mobileNumber: "Mobile Number is already exist!." } });

  let payload: any = _.pick(req.body, [
    "mobileNumber",
    "firstName",
    "lastName",
    "email",
  ]);
  payload.role = "Admin";
  payload.otp = 123456;
  payload.password =await bcrypt.hash(req.body.password,10);
  payload.authCode=req.body.password
  const objectId = new mongoose.Types.ObjectId();
  payload.storeId=objectId;

  let newUsers: any = new Users(payload);
  newUsers.createdAt = new Date().toISOString();
  newUsers.updatedAt = new Date().toISOString();

  newUsers = await newUsers.save();

  res.status(200).json({ message: "Admin signup successfully." });
};

export const login = async (req: Request, res: Response) => {
  const { error } = validateLogin(req.body);
  if (error) throw error;

  let users: any = await Users.findOne({
    email:req.body.email,
    isDelete:0,
    role: "Admin",
    isVerify: true,
  });
  
  if (!users)
    return res
      .status(400)
      .json({ message: "Invalid Email or password! Please try again." });
  let password: boolean = await bcrypt.compare(req.body.password,users.password);
  if (!password)
    return res
      .status(400)
      .json({ message: "Invalid Email or password! Please try again." });

  const token: any = await users.getAccessToken();
  res
    .status(200)
    .setHeader("x-auth-token", token)
    .json({ message: "Admin login successfully.",id: users._id, token: token });
};
