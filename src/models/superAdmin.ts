import { Schema } from "mongoose";
import { encrypt } from "../helper/encription";
import config from "config";
import jwt from "jsonwebtoken";

export const superAdminSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, default: "" },
    mobileNumber: { type: String, default: "" },
    gender: { type: String, default: "" },
    dob: { type: String, default: "" },
    profilePic:  { type: String, default: "" },
    password: { type: String, default: "" },
    authCode:{type: String, default: "" },
    isVerify: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "superAdmin" }
);

superAdminSchema.methods.getAccessToken = function () {
  const token = jwt.sign({ cid: this._id }, config.get("jwtPrivateKey"));
   return encrypt(token);
}