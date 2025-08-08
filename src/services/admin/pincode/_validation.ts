import { model } from "mongoose";
import { pincodeSchema } from "../../../models/pincode";

export const PinCode = model("pincode", pincodeSchema);