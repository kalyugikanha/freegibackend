import { Request, Response } from "express";
import {
  Area,
  validateAdd,
  validateDelete,
  validateUpdate,
} from "./_validation";
import _ from "lodash";

export const list = async (req: Request, res: Response) => {
  const area = await Area.find().sort({ _id: -1 }).lean();

  res.status(200).json({ data: area });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: { data: error?.message.replace(/\"/g, "").toString() } });

  let address: any = await Area.findOne({
    name: req.body.name,
    userId: req.body.cid,
  });
  if (address)
    return res.status(400).json({ message: "Area is already exists." });

  let newAddress: any = new Area(_.pick(req.body, ["name", "pincode"]));
  newAddress.userId = req.body.cid;
  newAddress = await newAddress.save();

  const area = await Area.find({ userId: req.body.cid })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: area, message: "Area added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: { data: error?.message.replace(/\"/g, "").toString() } });

  let addressTag: any = await Area.findOne({
    name: req.body.name,
    userId: req.body.cid,
  });
  if (addressTag)
    return res.status(400).json({ message: "Area is already exists." });

  let area: any = await Area.findOne({ _id: req.body.id });
  if (!area) return res.status(400).json({ message: "No record found." });

  if (req.body.name) area.name = req.body.name;
  if (req.body.pincode) area.pincode = req.body.pincode;

  area = await area.save();

  res.status(200).json({ message: "Area updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: { data: error?.message.replace(/\"/g, "").toString() } });

  // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
  // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });

  await Area.deleteOne({ _id: req.body.id });

  res.status(200).json({ message: "Area deleted successfully." });
};
