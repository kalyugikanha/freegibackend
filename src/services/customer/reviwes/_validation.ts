import { model } from "mongoose";
import { reviewSchema } from "../../../models/reviews";

export const Reviews = model("Reviews", reviewSchema);
