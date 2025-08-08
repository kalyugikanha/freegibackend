import { model } from "mongoose";
import { subCategorySchema } from "../../../models/subCategory";
import Joi from "joi";
import { productSchema } from "../../../models/product";

export const SubCategory = model("SubCategory", subCategorySchema);
export const Product = model("Product", productSchema);


export const validateAdd = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    category: Joi.string().hex().length(24).required().label("category"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateUpdate = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
    name: Joi.string().required().label("Name"),
    category: Joi.string().hex().length(24).required().label("category"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateStatus = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
    status: Joi.string().required().label("Status"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
