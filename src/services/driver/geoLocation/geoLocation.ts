import { Request, Response } from "express";
import { DriverGeoLocation, Orders, validateAdd, validateDeliveryEnd } from "./_validation";
import _ from "lodash";
import mongoose from "mongoose";

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let driver: any = await DriverGeoLocation.findOne({ driver: req.body.cid, orderId: new mongoose.Types.ObjectId(req.body.orderId)});

  if (driver) {
    driver.lat = req.body.lat;
    driver.long = req.body.long;
    driver.orderId = req.body.orderId;
    driver.updatedAt = new Date().toISOString();
    driver = await driver.save();

    await Orders.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.orderId) }, { $set: { status: "shipped" } });
  } else {
    let payload: any = _.pick(req.body, ["date", "lat", "long", "orderId"]);
    let geoLocation: any = new DriverGeoLocation(payload);
    geoLocation.date = new Date().toISOString();
    geoLocation.driver = req.body.cid;
    geoLocation.orderId = req.body.orderId;
    geoLocation = await geoLocation.save();

    await Orders.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.orderId)}, { $set: { status: "confirmed", deliveryAgent:  req.body.cid, updatedAt: new Date().toISOString() } });
  }

  res.status(200).json({ message: "Geo Location saved successfully." });
};

export const deliveryEnd = async (req: Request, res: Response) => {
  const { error } = validateDeliveryEnd(req.body);
  if (error) throw error;

  // const order: any = await Orders.findOne({ orderId: req.body.orderId });
  await Orders.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.orderId) }, { $set: { status: "delivered", deliveryDate: new Date().toISOString(), updatedAt: new Date().toISOString() } });

  res.status(200).json({ message: "End delivery successfully." })
}
