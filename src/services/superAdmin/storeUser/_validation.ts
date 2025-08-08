import { model } from "mongoose";
import { usersSchema } from "../../../models/users";
import Joi from "joi";

export const Users = model("Users", usersSchema);


export const validateRegister = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    firstName: Joi.string().required().label("Firstname"),
    lastName: Joi.string().required().label("Lastname"),
    mobileNumber: Joi.string().required().label("MobileNumber"),
    password: Joi.string().required().label("password"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
}
