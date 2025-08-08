import { model } from "mongoose";
import { productSchema } from "../../../models/product";

export const Product = model("Product", productSchema);
