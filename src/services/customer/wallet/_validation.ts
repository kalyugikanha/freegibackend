import { model } from "mongoose";
import { walletSchema } from "../../../models/wallet";
import { usersSchema } from "../../../models/users";
import Joi from "joi";

export const wallet = model("wallet", walletSchema);
export const Users = model("Users", usersSchema);

export const validate = (data: any) => {
    const schema = Joi.object({
        userId: Joi.string().required().label("userId")
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateAdd = (data: any) => {
    const schema = Joi.object({
        userId: Joi.string().required().label("userId"),
        amount: Joi.number().required().label("amount"),
        orderId: Joi.string().required().label("orderId"),
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};