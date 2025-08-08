import { Request, Response } from "express";
import {
  Address,
  validateAdd,
  validateDelete,
  validateSelectDefault,
  validateUpdate,
} from "./_validation";
import _ from "lodash";
import mongoose from "mongoose";

export const list = async (req: Request, res: Response) => {
  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  const address = await Address.find({
    $and: [filter, {userId: new mongoose.Types.ObjectId(req.body.userId)}],
  })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: address });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let address: any = await Address.findOne({
    tag: req.body.tag,
    userId: req.body.cid,
  });
  if (address)
    return res.status(400).json({ message: "Tag is already exists." });

  let newAddress: any = new Address(
    _.pick(req.body, ["tag", "addressType", "floor", "address", "landMark", "pincode", "lat", "long"])
  );
  newAddress.userId = req.body.cid;
  newAddress = await newAddress.save();

  res.status(200).json({ message: "Address added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let addressTag: any = await Address.findOne({
    tag: req.body.tag,
    userId: req.body.cid,
    $ne: { _id: req.body.id },
  });
  if (addressTag === req.body.id)
    return res.status(400).json({ message: "Tag is already exists." });

  let address: any = await Address.findOne({ _id: req.body.id });
  if (!address) return res.status(400).json({ message: "No record found." });

  if (req.body.tag) address.tag = req.body.tag;
  if (req.body.addressType) address.addressType = req.body.addressType;
  if (req.body.floor) address.floor = req.body.floor;
  if (req.body.address) address.address = req.body.address;
  if (req.body.landMark) address.landMark = req.body.landMark;
  if (req.body.pincode) address.pincode = req.body.pincode;
  if (req.body.lat) address.lat = req.body.lat;
  if (req.body.long) address.long = req.body.long;

  address = await address.save();

  res.status(200).json({ message: "Address updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
  // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });

  await Address.deleteOne({ _id: req.body.id });

  res.status(200).json({ message: "Address deleted successfully." });
};

export const selectDefault = async (req: Request, res: Response) => {
  const { error } = validateSelectDefault(req.body);
  if (error) throw error;

  let address: any = await Address.findOne({ _id: new mongoose.Types.ObjectId(req.body.id) });
  if (!address) return res.status(400).json({ message: "No record found." });

  await Address.updateMany({ userId: new mongoose.Types.ObjectId(req.body.userId) }, { $set: { default: false } });
  await Address.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: { default: true } });

  res.status(200).json({ message: "Default Address set successfully." });
}