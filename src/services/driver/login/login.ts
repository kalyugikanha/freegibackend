import { Request, Response } from "express";
import {
  Users,
  validateLogin,
  validateMobile,
  validateVerify,
  validateSignup,
} from "./_validation";
import _ from "lodash";
import bcrypt from "bcrypt";

export const signup = async (req: Request, res: Response) => {
  const { error } = validateMobile(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: { data: error?.message.replace(/\"/g, "").toString() } });

  let users: any = await Users.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (users) {
    users.otp = 123456;
    users = await users.save();

    res.status(200).json({ message: "OTP sent successfully." });
  } else {
    let payload: any = _.pick(req.body, ["mobileNumber"]);
    payload.role = "DeliveryAgent";
    payload.otp = 123456;

     

    let newUsers: any = new Users(payload);
    newUsers.createdAt = new Date().toISOString();
    newUsers.updatedAt = new Date().toISOString();

    newUsers = await newUsers.save();

    res.status(200).json({ message: "OTP sent successfully." });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { error } = validateVerify(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: { data: error?.message.replace(/\"/g, "").toString() } });

  let users: any = await Users.findOne({
    mobileNumber: req.body.mobileNumber,
    otp: req.body.otp,
  });
  if (!users)
    return res.status(400).json({ message: "Verification Code not matched." });

  users.isVerify = true;
  // doctor.status = "success";

  users.updatedAt = new Date().toISOString();
  users = await users.save();

  res.status(200).json({ message: "Delivery agent verified successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateSignup(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: { data: error?.message.replace(/\"/g, "").toString() } });

  let users: any = await Users.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (!users) return res.status(404).json({ message: "No record found." });
  if (req.body.email) {
    let isEmailExist: any = await Users.findOne({
      email: req.body.email,
      _id: {
        $ne: users._id,
      },
    });
    if (isEmailExist)
      return res.status(400).json({ message: "Email address already in use." });
  }

  users = _.assign(users, _.pick(req.body, ["email", "firstName", "lastName"]));

  let hashedPassword;
        if (req.body.password) {
          const saltRounds = 10;
          hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        }
   
        users.password=hashedPassword ||users.password,
        users.authCode=req.body?.password||users.authCode
  users.updatedAt = new Date().toISOString();
  users = await users.save();

  const token: any = await users.getAccessToken();

  res
    .status(200)
    .json({
      token: token,
      id: users._id,
      message: "Delivery agent signup successfully.",
    });
};

export const login = async (req: Request, res: Response) => {
  const { error } = validateLogin(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: { data: error?.message.replace(/\"/g, "").toString() } });

  let users: any = await Users.findOne({
    email: req.body.email,
  });
  console.log(users);
  
  if (users==null){
    return res
     .status(400)
     .json({ message: "Invalid Email or password! Please try again...." });
  }
    
  let password: boolean = await bcrypt.compare(req.body.password,users.password);
  if (!password){
    return res
      .status(400)
      .json({ message: "Invalid Email or password! Please try again...." });}

  if(users.isVerify != undefined && !users.isVerify) {
    return res
      .status(400)
      .json({ message: "Administrator is not verify your account contact with administrator" });
  }

  const token: any = await users.getAccessToken();
  res
    .status(200)
    .json({
      token: token,
      id: users._id,
      message: "Delivery agent login successfully.",
    });
};
