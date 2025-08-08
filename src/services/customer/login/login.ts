import { Request, Response } from "express";
import {
  Users,
  PinCode,
  validateLogin,
  // validateMobile,
  validateVerify,
  // validateSignup,
} from "./_validation";
// import Crypto from "crypto";
import _ from "lodash";
// import { decrypt, encrypt } from "../../../helper/encription";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const signup = async (req: Request, res: Response) => {
  try {
    // const { error } = validateMobile(req.body);
    // if (error) throw error;

    let users: any = await Users.findOne({
      mobileNumber: req.body.mobileNumber,
    });

    if (users) {
      return res.status(400).json({
        error: { mobileNumber: "Mobile Number already exists!." },
      });
    }
    // let hashedPassword = "";
    // if (req.body.password) {
    //   const saltRounds = 10;
    //   hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    // }
    // let pinCodeExist=await PinCode.findOne({
    //   pincode:req.body.pincode
    // })
    // if(!pinCodeExist){
    //   return res.status(400).json({
    //     error: { pincode: "Pincode does not exist!." },
    //   });
    // }
      // password:hashedPassword ,
      // storeId:pinCodeExist?.storeId,
   
    let payload: any = {
      firstName: req.body.firstName || "",
      lastName: req.body.lastName || "",
      email: req.body.email || "",
      mobileNumber: req.body.mobileNumber,
      role: "Customer", 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    payload.otp = 123456;
    let newUser: any = new Users(payload);
    newUser = await newUser.save();

    res.status(200).json({
      message: "OTP sent successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { error } = validateVerify(req.body);
  if (error) throw error;

  let users: any = await Users.findOne({
    mobileNumber: req.body.mobileNumber,
    otp: req.body.otp,
  });
  if (!users)
    return res.status(400).json({ message: "Verification Code not matched." });

  users.verificationCode = "";
  // doctor.status = "success";

  users.updatedAt = new Date().toISOString();
  users = await users.save();

  res.status(200).json({ message: "Customer verified successfully." });
};

export const update = async (req: Request, res: Response) => {


  let users: any = await Users.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (!users) return res.status(404).json({ message: "No record found." });
  if (req.body.email) {
    const isEmailExist: any  = await Users.findOne({
      email: req.body.email,
      _id: {
        $ne: users._id,
      },
    });

    if (isEmailExist) {
      return res.status(400).json({ message: "Email address already in use." });
    }
  }


  users = _.assign(users, _.pick(req.body, ["email", "firstName", "lastName",]));

  
   let hashedPassword;
    if (req.body.password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    }
    // let pinCodeExist=await PinCode.findOne({
    //   pincode:req.body.pincode
    // })
    // if(!pinCodeExist){
    //   return res.status(400).json({
    //     error: { pincode: "Pincode does not exist!." },
    //   });
    // }
      users.password=hashedPassword ?hashedPassword:users.password,
      // users.storeId=pinCodeExist?.storeId,
    
  users.authCode=req.body?.password||users.authCode
  users.updatedAt = new Date().toISOString();
  users = await users.save();

  const token: any = await users.getAccessToken();

  res
    .status(200)
    .setHeader("x-auth-token", token)
    .json({ message: "Customer Update successfully." });
};

export const login = async (req: Request, res: Response) => {
  const { error } = validateLogin(req.body);
  if (error) throw error;

  let users: any = await Users.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (!users)
    return res.status(400).json({
      message: "Invalid Mobile number or password! Please try again.",
    });
  let password: boolean = await bcrypt.compare(req.body.password,users.password);
  if (!password)
    return res.status(400).json({
      message: "Invalid Mobile number or password! Please try again.",
    });
//     if (req.body.pincode) {
//       let pinCodeExist = await PinCode.findOne({ pincode:req.body.pincode });
//       if (!pinCodeExist) {
//         return res.status(400).json({
//           error: { pincode: 'Pincode does not exist!' },
//         });
//       }
//     if (
//       !users.storeId || 
//       users.storeId.toString() !== new mongoose.Types.ObjectId(pinCodeExist.storeId).toString()
//     ) {
//       users.storeId = new mongoose.Types.ObjectId(pinCodeExist.storeId);
//     }

//     users.pincode = req.body.pincode;

//   users.updatedAt = new Date();

//   await users.save();
// }

  const token: any = await users.getAccessToken();
  res
    .status(200)
    .setHeader("x-auth-token", token)
    .json({ message: "Customer login successfully.", id: users._id, token: token });
};


export const pincodeUpdate = async (req: Request, res: Response) => {
  // res.json({
  //   data:req.body?.cid
  // })
  let pinCodeExist=await PinCode.findOne({
    pincode:req.body?.pincode
  })
  if(!pinCodeExist){
    return res.status(400).json({
      error: { pincode: "No service is available for this pincode." },
    });
  }
  let users: any = await Users.findOne({
   _id:new mongoose.Types.ObjectId(req.body.cid)
  });
 
  if (
    !users.storeId || 
    users.storeId.toString() !== new mongoose.Types.ObjectId(pinCodeExist.storeId).toString()
  ) {
    users.storeId = new mongoose.Types.ObjectId(pinCodeExist.storeId);
    users.pincode = req.body.pincode;
  }



  // users.password = await bcrypt.hash(req.body.password,10);
  // users.authCode=req.body.password
  users.updatedAt = new Date().toISOString();
  users = await users.save();
  const token: any = await users.getAccessToken();
  res
    .status(200)
    .setHeader("x-auth-token", token)
    .json({ message: "Customer login successfully.", id: users._id, token: token});
}
