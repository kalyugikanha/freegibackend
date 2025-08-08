import { model } from "mongoose";
import { featureditemSchema } from "../../../models/featureditem";
import { productSchema } from "../../../models/product";
import Joi from "joi";

export const featureditem = model("featureditem", featureditemSchema);
export const Product = model("Product", productSchema);

export const validate = (data: any) => {
    const schema = Joi.object({
        productIds: Joi.array().required().label("productIds"),
    });
  
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
  };
  

export const validateRemove = (data: any) => {
    const schema = Joi.object({
        id: Joi.string().hex().length(24).required().label("id"),
    });
  
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
  