import { model } from "mongoose";
import { superAdminSchema } from "../../../models/superAdmin";
import Joi from "joi";

export const SuperAdmin = model("superAdmin", superAdminSchema);

export const validateSignup = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    firstName: Joi.string().required().label("Firstname"),
    lastName: Joi.string().required().label("Lastname"),
    mobileNumber: Joi.string().required().label("MobileNumber"),
    password: Joi.string().required().label("password"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Mobile or Email"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
