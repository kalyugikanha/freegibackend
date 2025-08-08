import { model } from "mongoose";
import { usersSchema } from "../../../models/users";
import { addressSchema } from "../../../models/address";
import Joi from "joi";

export const Users = model("Users", usersSchema);

export const Address = model("Address", addressSchema);

export const validateUpdate = (data: any) => {
    const schema = Joi.object({
      id: Joi.string().hex().length(24).required().label("ID")
    });
  
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
  };
  