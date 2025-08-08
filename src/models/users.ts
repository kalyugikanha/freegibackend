import { Schema } from "mongoose";
import { encrypt } from "../helper/encription";
import config from "config";
import jwt from "jsonwebtoken";

export const usersSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    storeName:{ type: Schema.Types.String, default:""},
    storeAddress: { type: Schema.Types.String, default: "" },
    ownerName:{ type: Schema.Types.String, default:""},
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, default: "" },
    mobileNumber: { type: String, default: "" },
    gender: { type: String, default: "" },
    dob: { type: String, default: "" },
    profilePic:  { type: String, default: "" },
    otp: { type: Number, default: "" },
    password: { type: String, default: "" },
    role: { type: String, enum: ["Admin", "Customer", "DeliveryAgent"] },
    isVerify: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    authCode: { type: String, default:""},
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    pincode:{type:String, default:""},
    isDelete:{
      type: Number,
      default: 0,
    },
    storeId:{
      type: Schema.Types.ObjectId,
    }
  },
  { collection: "users" }
);

usersSchema.methods.getAccessToken = function () {
  const token = jwt.sign({ cid: this._id,storeId:this?.storeId||null }, config.get("jwtPrivateKey"));
  return encrypt(token);
};
