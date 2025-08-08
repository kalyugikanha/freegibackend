import { model } from "mongoose";
import Joi from "joi";
import { freeProductSchema } from "../../../models/freeProduct";

export const FreeProduct = model("freeProduct", freeProductSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    // price: Joi.number().required().label("Price"),

  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateUpdate = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    // price: Joi.number().required().label("Price"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};




