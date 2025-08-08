import { model } from "mongoose";
import { dealofthedaySchema } from "../../../models/dealoftheday";
import { productSchema } from "../../../models/product";
import Joi from "joi";
import { optionSchema } from "../../../models/option";

export const dealoftheday = model("dealoftheday", dealofthedaySchema);
export const Product = model("Product", productSchema);
export const Option = model("option", optionSchema);

export const validate = (data: any) => {
  const schema = Joi.object({
    name: Joi.string(),
    image: Joi.string().uri(), // Validate image URL
    price: Joi.number(),
    description: Joi.string(),
    products: Joi.array().min(1).items(
      Joi.object({
        productId: Joi.string().required(),
        optionId: Joi.string().required(),
      })
    ).required(),
  });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
  };
export const validateRemove = (data: any) => {
    const schema = Joi.object({
        id: Joi.string().hex().length(24).required().label("id"),
    });
  
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
  