import { Request, Response } from "express";
import {
  Users,
  // validateRegister,
} from "./_validation";
// import Crypto from "crypto";
import _ from "lodash";
// import { decrypt, encrypt } from "../../../helper/encription";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const register = async (req: Request, res: Response) => {
  try {
    // const { error } = validateRegister(req.body);
    // if (error) throw error;

    let users: any = await Users.findOne({
        isDelete:0,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      role: "Admin"
    });
  

    if (users) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }
    let hashedPassword = "";
    if (req.body.password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    }
   
   
    let payload: any = {
      storeName: req.body.storeName,
      storeAddress: req.body.storeAddress,
      ownerName:req.body.ownerName,
      email: req.body.email ,
      mobileNumber: req.body.mobileNumber,
      password:hashedPassword ,
      role: "Admin", 
      isVerify:true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const objectId = new mongoose.Types.ObjectId();
    payload.authCode=req.body.password
    payload.storeId = objectId
    
    let newUser: any = new Users(payload);
    newUser = await newUser.save();

    res.status(200).json({
      message: "Store created successfully.",
      user: newUser, 
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Something went wrong!" });
  }
};
export const getUser = async (req: Request, res: Response) => {
    let {page,limit}=req.body;
    let users: any = await Users.find({
        isDelete:0,
        role: "Admin"
    }).select("-gender -firstName -lastName -dob").skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
    let totalUsers: any = await Users.countDocuments({
        isDelete:0,
        role: "Admin"
    });

    res.status(200).json({ data: {
        users: users,
        totalUsers: totalUsers
    },status:200 });
};
export const update = async (req: Request, res: Response) => {

    let id=req.params.id
    let users: any = await Users.findOne({
        _id: {
            $eq: id,
        },
        isDelete:0,
         role: "Admin"
      });

    if(req.body.mobileNumber){
  let checkMobile: any = await Users.findOne({
    _id: {
        $ne: id,
    },
    isDelete:0,
    mobileNumber: req.body.mobileNumber,
    role: "Admin"
  });
  if (checkMobile){
    return res.status(400).json({ message: "Mobile Number already exists.",status:400 });
  }
}
  if (req.body.email) {
    let isEmailExist: any = await Users.findOne({
        _id: {
            $ne: id,
        },
        isDelete:0,
         role: "Admin",
      email: req.body.email,
    });
    if (isEmailExist)
      return res.status(400).json({ message: "Email address already in use.",status:400 });
  }

  users = _.assign(users, _.pick(req.body,["email",'mobileNumber','storeName','storeAddress','ownerName','isVerify']));

  users.updatedAt = new Date().toISOString();
  users = await users.save();

  res.status(200).json({ message: "Store updated successfully.",status:200, data:users}); 
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        let id = req.params.id;

        // Check if the user exists
        let user = await Users.findOne({
            _id: id,
            isDelete: 0,
            role: "Admin" // Only admins can delete users
        });
        if (!user) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }

        // Update user to mark as deleted
       await Users.findByIdAndUpdate(
            id,
            { isDelete: 1 },
            { new: true }
        ).exec();

        return res.status(200).json({ 
            message: "Store deleted successfully", 
            // user: updatedUser
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Internal server error", });
    }
};

export const getSingleUser = async (req: Request, res: Response) => {
    let id = req.params.id;
    let user = await Users.findOne({
        _id: id,
        isDelete: 0,
        role: "Admin"
    }).select("-gender -firstName -lastName -dob");
  
    res.status(200).json({ user: user||{}, status: 200 });
}