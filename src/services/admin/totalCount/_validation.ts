import { model } from "mongoose";
import { categorySchema } from "../../../models/category";
import { productSchema } from "../../../models/product";
import { usersSchema } from "../../../models/users";
import { paymentSchema } from "../../../models/payment";
import { orderSchema } from "../../../models/order";

export const Category = model("Category", categorySchema);
export const Product = model("Product", productSchema);
export const Users = model("Users", usersSchema);
export const Payment = model("Payment", paymentSchema);
export const Order = model("Order", orderSchema);
