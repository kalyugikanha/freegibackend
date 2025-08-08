import { model } from "mongoose";
import { orderSchema } from "../../../models/order";

export const Order = model("Order", orderSchema);
