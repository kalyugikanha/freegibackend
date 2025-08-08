import { Request, Response } from "express";
import { customerServices } from "./_validation";
import mongoose from "mongoose";

export const add = async (req: Request, res: Response) => {
    // const { error } = validateAdd(req.body);
    // if (error) throw error;

    let newCustomerServices: any = new customerServices();
    newCustomerServices.userId = new mongoose.Types.ObjectId(req.body.userId);
    newCustomerServices.email = req.body.email;
    newCustomerServices.mobileNumber = req.body.mobileNumber;
    newCustomerServices.feedback = req.body.feedback;
    newCustomerServices.storeId = req.body.storeId
    newCustomerServices.bookingId = req.body.bookingId;
    newCustomerServices.createdAt = new Date().toISOString();
    newCustomerServices.updatedAt = new Date().toISOString();
    newCustomerServices = await newCustomerServices.save();

    res.status(200).json({ message: "Added successfully." });
};
