import { model } from "mongoose";
import { taxSchema } from "../../../models/tax";

export const Tax = model("Tax", taxSchema);
