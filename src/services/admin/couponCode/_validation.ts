import { model } from "mongoose";
import { couponCodeSchema } from "../../../models/couponCode";
import Joi from "joi";

export const CouponCode = model("CouponCode", couponCodeSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    code: Joi.string().required().label("Code"),
    type: Joi.string().valid("percentage", "rupees").optional().label("Type"),
    minPrice: Joi.number().min(0).default(0).optional().label("Min Price"),
    maxPrice: Joi.number().min(0).default(0).optional().label("Max Price"),
    endDate: Joi.date().optional().label("End Date"),
    limit: Joi.number().integer().min(0).default(0).optional().label("Usage Limit"),
    discount: Joi.number().min(0).required().label("Discount"),
    status: Joi.string().valid("enable", "disable").default("enable").optional().label("Status"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateUpdate = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
    name: Joi.string().optional().label("Name"),
    code: Joi.string().optional().label("Code"),
    type: Joi.string().valid("percentage", "rupees").optional().label("Type"),
    minPrice: Joi.number().min(0).optional().label("Min Price"),
    maxPrice: Joi.number().min(Joi.ref("minPrice")).optional().label("Max Price"),
    endDate: Joi.date().optional().label("End Date"),
    limit: Joi.number().integer().min(0).optional().label("Usage Limit"),
    discount: Joi.number().min(0).optional().label("Discount"),
    status: Joi.string().valid("enable", "disable").optional().label("Status"),
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
