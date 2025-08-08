import { model } from "mongoose";
import { messageSchema } from "../../../models/messages";

export const Message = model("Message", messageSchema);
