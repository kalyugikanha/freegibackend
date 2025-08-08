import { model } from "mongoose";
import { categorySchema } from "../../../models/category";

export const Category = model("Category", categorySchema);
