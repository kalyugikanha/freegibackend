import { model } from "mongoose";
import { drivingLicenceSchema } from "../../../models/drivingLicence";
import Joi from "joi";

export const DrivingLicence = model("DrivingLicence", drivingLicenceSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    image: Joi.string().required().label("Image"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateUpdate = (data: any) => {
  const schema = Joi.object({
    aadhar: Joi.string().required().label("Aadhar"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
