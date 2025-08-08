import { model } from "mongoose";
import Joi from "joi";
import { addressSchema } from "../../../models/address";

export const Address = model("Address", addressSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    tag: Joi.string().required().label("Tag"),
    pincode: Joi.string().required().label("pincode"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateUpdate = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
    tag: Joi.string().required().label("tag"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateSelectDefault = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
    userId: Joi.string().required().label("userId")
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
