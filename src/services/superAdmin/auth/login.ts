import { Request, Response } from "express";
import { SuperAdmin, validateLogin, validateSignup } from "./_validation";
import _ from "lodash"; 
import bcrypt from "bcrypt";
export const signup = async (req: Request, res: Response) => {
  try {
    const { error } = validateSignup(req.body);
    if (error) throw error;

    let users: any = await SuperAdmin.findOne({
      mobileNumber: req.body.mobileNumber,
    });

    if (users) {
      return res.status(400).json({
        error: { mobileNumber: "Mobile Number already exists!." },
      });
    }
    let hashedPassword = "";
    if (req.body.password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    }
   
   
    let payload: any = {
      firstName: req.body.firstName || "",
      lastName: req.body.lastName || "",
      email: req.body.email || "",
      mobileNumber: req.body.mobileNumber,
      password:hashedPassword ,
      role: "Customer", 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    payload.authCode=req.body.password
    let newUser: any = new SuperAdmin(payload);
    newUser = await newUser.save();
    
    res.status(200).json({
      message: "Signup successful",
      user: newUser, 
      status: 200,
    });
  } catch (err) {
    console.error(err);
    res.status(200).json({
        message: "Internal Server Error",
        error: err,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { error } = validateLogin(req.body);
  if (error) throw error;

  let users: any = await SuperAdmin.findOne({
    email: req.body.email,
  });
  if (!users)
    return res
      .status(400)
      .json({ message: "Invalid Email or password! Please try again." });
  let hashedPassword: boolean = await bcrypt.compare(req.body?.password,users?.password);
  if (!hashedPassword)
    return res
      .status(400)
      .json({ message: "Invalid Email or password! Please try again." });

  const token: any = await users.getAccessToken();
  res
    .status(200)
    .setHeader("x-auth-token", token)
    .json({ message: "SuperAdmin login successfully.", id: users._id, token: token });
};
