import { model } from "mongoose";
import { driverGeoLocationSchema } from "../../../models/driverGeoLocation";
import Joi from "joi";
import { orderSchema } from "../../../models/order";

export const DriverGeoLocation = model("DriverGeoLocation", driverGeoLocationSchema);
export const Orders = model("Orders", orderSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    lat: Joi.string().required().label("Lat"),
    long: Joi.string().required().label("Long"),
    orderId: Joi.string().required().label("orderId"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDeliveryEnd = (data: any) => {
  const schema = Joi.object({
    orderId: Joi.string().required().label("orderId"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
