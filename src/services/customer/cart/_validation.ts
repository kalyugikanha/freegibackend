import { model } from "mongoose";
import Joi from "joi";
import { cartSchema } from "../../../models/cart";
import { orderSchema } from "../../../models/order";

export const Cart = model("Cart", cartSchema);
export const Orders = model("Orders", orderSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    cid: Joi.string().required().label("cid"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateUpdate = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required().label("userId"),
    id: Joi.string().required().label("id"), // Cart ID
    productId: Joi.string().required().label("productId"),
    optionId: Joi.string().required().label("optionId"), // Product Option ID
    quantity: Joi.number().required().label("quantity"),
    price: Joi.number().required().label("price")
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};


export const validateRemove = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().required().label("Cart ID"),
    userId: Joi.string().required().label("User ID"),
    productId: Joi.string().optional().label("Product ID"),
    optionId: Joi.string().optional().label("Option ID"),
    dealOfTheDayId: Joi.string().optional().label("Deal of the Day ID"),
  })
    .or("productId", "dealOfTheDayId")
    .with("productId", "optionId");

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
