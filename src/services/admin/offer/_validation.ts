import { model } from "mongoose";
import Joi from "joi";
import { freeProductSchema } from "../../../models/freeProduct";

export const FreeProduct = model("freeProduct", freeProductSchema);

export const validateAdd = (data: any) => {
    const schema = Joi.object({
      name: Joi.string().trim().required().label("Name"),
      freeProductId: Joi.string().optional().label("Free Product ID"),
      minPrice: Joi.number().min(0).optional().label("Min Price"),
      maxPrice: Joi.number().min(0).optional().label("Max Price"),
      isDeliver: Joi.number().valid(0, 1).optional().label("Is Deliver"),
    });
  
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
  };
  
  // ✅ Validation Schema for Updating a Product
  export const validateUpdate = (data: any) => {
    const schema = Joi.object({
      name: Joi.string().trim().required().label("Name"),
      freeProductId: Joi.string().optional().label("Free Product ID"),
      minPrice: Joi.number().min(0).optional().label("Min Price"),
      maxPrice: Joi.number().min(0).optional().label("Max Price"),
      isDeliver: Joi.number().valid(0, 1).optional().label("Is Deliver"),
    });
  
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
  };
