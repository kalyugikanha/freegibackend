import { model } from "mongoose";
import { orderSchema } from "../../../models/order";
import { paymentSchema } from "../../../models/payment";

export const Orders = model("Orders", orderSchema);
export const Payments = model("Payments", paymentSchema);
