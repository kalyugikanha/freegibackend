import { model } from "mongoose";
import { subCategorySchema } from "../../../models/subCategory";

export const SubCategory = model("SubCategory", subCategorySchema);
