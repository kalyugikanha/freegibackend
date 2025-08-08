import { model } from "mongoose";
import { couponCodeSchema } from "../../../models/couponCode";

export const CouponCode = model("CouponCode", couponCodeSchema);
