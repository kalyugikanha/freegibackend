import { model } from "mongoose";
import Joi from "joi";
import { cartOffer } from "../../../models/cartOffer";
import { freeProductSchema } from "../../../models/freeProduct";

export const CartOffer = model("cartOffer", cartOffer);
export const FreeProduct = model("freeProduct", freeProductSchema);


export const validateAdd = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    minPrice: Joi.number().min(0).required().label("Min Price"),
    maxPrice: Joi.number().min(0).required().label("Max Price"),
    freeProductId: Joi.array().items(Joi.string()).label("Free Product IDs"),
    isFreeDeliver: Joi.number().valid(0, 1).default(0).label("Free Delivery"),
  });

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};

export const validateUpdate = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().optional().label("Name"),
    minPrice: Joi.number().min(0).optional().label("Min Price"),
    maxPrice: Joi.number().min(0).optional().label("Max Price"),
    freeProductId: Joi.array().items(Joi.string()).optional().label("Free Product IDs"),
    isFreeDeliver: Joi.number().valid(0, 1).optional().label("Free Delivery"),
  });

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};



