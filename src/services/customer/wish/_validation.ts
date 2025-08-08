import { model } from "mongoose";
import { wishSchema } from "../../../models/wish";
import Joi from "joi";

export const wish = model("wish", wishSchema);

export const validateList = (data: any) => {
    const schema = Joi.object({
        userId: Joi.string().required().label("userId")
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validate = (data: any) => {
    const schema = Joi.object({
        userId: Joi.string().required().label("userId"),
        productId: Joi.string().required().label("productId")
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};