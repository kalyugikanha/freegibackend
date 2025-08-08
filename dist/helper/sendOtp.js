"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = void 0;
const axios_1 = __importDefault(require("axios"));
const sendOTP = (mobileNumber, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = "430615AYdI3IDtv0d6731bbb7P1"; // Replace with your MSG91 API key
    //   const senderId = "FREEGI"; // Replace with your Sender ID
    const templateId = "67174251d6fc056aa45e3922"; // Replace with your OTP template ID
    const options = {
        method: "POST",
        url: "https://control.msg91.com/api/v5/flow",
        headers: {
            authkey: apiKey,
            accept: "application/json",
            "content-type": "application/json",
        },
        data: {
            template_id: templateId,
            short_url: "0",
            recipients: [
                {
                    mobiles: `91${mobileNumber}`,
                    otp: otp,
                },
            ],
        },
    };
    console.log(options);
    try {
        const { data } = yield axios_1.default.request(options);
        console.log("OTP Sent Successfully:", data);
        if (!!data) {
            return true;
        }
    }
    catch (error) {
        // console.error("Error sending OTP:", error);
        return false;
    }
});
exports.sendOTP = sendOTP;
//# sourceMappingURL=sendOtp.js.map