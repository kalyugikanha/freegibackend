import { model } from "mongoose";
import { orderSchema } from "../../../models/order";
import { paymentSchema } from "../../../models/payment";
import { driverGeoLocationSchema } from "../../../models/driverGeoLocation";
import Joi from "joi";
import { cartSchema } from "../../../models/cart";
import { walletSchema } from "../../../models/wallet";
import { usersSchema } from "../../../models/users";

export const Orders = model("Orders", orderSchema);
export const Payments = model("Payments", paymentSchema);
export const DriverGeoLocation = model("DriverGeoLocation", driverGeoLocationSchema);
export const Cart = model("Cart", cartSchema);
export const wallet = model("wallet", walletSchema);
export const Users = model("Users", usersSchema);

export function generateAutoID(length: number): any {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export const validateOrderLocation = (data: any) => {
    const schema = Joi.object({
        orderId: Joi.string().required().label("orderId")
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};