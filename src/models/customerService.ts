import { Schema } from "mongoose";

export const customerServicesSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        email: { type: String, default: "" },
        mobileNumber: { type: String, default: "" },
        feedback: { type: String, default: "" },
        bookingId: { type: String, default: "" },
        createdAt: { type: Date, default: new Date().toISOString() },
        updatedAt: { type: Date, default: new Date().toISOString() },
        storeId:{ type: Schema.Types.ObjectId},
    },
    { collection: "customerservices" }
);