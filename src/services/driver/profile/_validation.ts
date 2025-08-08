import { model } from "mongoose";
import { usersSchema } from "../../../models/users";

export const Users = model("Users", usersSchema);
