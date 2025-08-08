import { Request, Response } from "express";
import { wallet, validateAdd, Users, validate } from "./_validation";
import mongoose from "mongoose";
const crypto = require("crypto");
const Razorpay = require('razorpay');
const key_secret = "FacIUNRcazCNMXvuosaO86hv";
const razorpayInstance = new Razorpay({
    key_id: "rzp_test_4xd5P3os7w8Pon",
    key_secret: key_secret
});

export const amountDetail = async (req: Request, res: Response) => {
    const { error } = validate(req.body);
    if (error) throw error;

    const user = await Users.findOne({ _id: req.body.userId });
    res.status(200).json({ message: "successfully.", data: user?.amount ?? 0 });
}

export const add = async (req: Request, res: Response) => {
    const { error } = validateAdd(req.body);
    if (error) throw error;

    let newWallet: any = new wallet();
    newWallet.userId = req.body.userId;
    newWallet.amount = req.body.amount;
    newWallet.status = "pending";
    newWallet.orderId = req.body.orderId;
    newWallet.createdAt = new Date().toISOString();
    newWallet.updatedAt = new Date().toISOString();
    newWallet = await newWallet.save();

    res.status(200).json({ message: "Added successfully." });
};

export const verifyPayment = async (req: Request, res: Response) => {
    const { orderId, paymentId, signature } = req.body;
    const keySecret = key_secret;
    const order: any = await wallet.findOne({ orderId: orderId });
    const generateSignature = crypto.createHmac("sha256", keySecret).update(orderId + "|" + paymentId).digest("hex");
    if (generateSignature == signature) {
        const detail = await razorpayInstance.payments.fetch(paymentId);
        await wallet.findByIdAndUpdate({ _id: order._id }, { $set: { status: "completed", signature: signature, paymentId: paymentId, transactionId: detail.acquirer_data.upi_transaction_id, paymentDate: new Date().toISOString() } });
        await Users.findByIdAndUpdate({ _id: order.userId }, { $inc: { amount: order.amount } });
        res.status(200).json({ message: "Payment verified" });
    }
    else {
        await wallet.findByIdAndUpdate({ _id: order._id }, { $set: { status: "failed", paymentDate: new Date().toISOString() } });
        res.status(400).json({ message: "Invaild signature" });
    }
}

export const list = async (req: Request, res: Response) => {
    const list = await wallet.find({ userId: new mongoose.Types.ObjectId(req.body.cid) }).sort({ createdAt: -1 }).exec();
    res.status(200).json({ data: list });
}
