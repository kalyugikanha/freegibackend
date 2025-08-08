import { model } from "mongoose";
import { usersSchema } from "../../../models/users";
import Joi from "joi";

export const Users = model("Users", usersSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("Firstname"),
    lastName: Joi.string().required().label("lastName"),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().required().label("password"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateUpdate = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
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
