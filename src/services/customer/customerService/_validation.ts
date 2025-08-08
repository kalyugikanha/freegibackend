import { model } from "mongoose";
import { customerServicesSchema } from "../../../models/customerService";
import Joi from "joi";

export const customerServices = model("customerServices", customerServicesSchema);

export const validateAdd = (data: any) => {
    const schema = Joi.object({
      userId: Joi.string().required().label("userId"),
      email: Joi.string().required().label("email"),
      mobileNumber: Joi.string().required().label("mobileNumber"),
      feedback: Joi.string().required().label("feedback")
    });
  
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
  };