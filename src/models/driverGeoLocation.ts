import { Schema } from "mongoose";

export const driverGeoLocationSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    date: { type: Date, default: new Date().toISOString() },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    orderId: {
      type: Schema.Types.ObjectId
    },
    lat: { type: String, required: [true, "Lat required."] },
    long: { type: String, required: [true, "Long required."] },
  },
  { collection: "driverGeoLocation" }
);
