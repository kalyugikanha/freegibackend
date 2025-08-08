"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdate = exports.validateAdd = exports.DrivingLicence = void 0;
const mongoose_1 = require("mongoose");
const drivingLicence_1 = require("../../../models/drivingLicence");
const joi_1 = __importDefault(require("joi"));
exports.DrivingLicence = (0, mongoose_1.model)("DrivingLicence", drivingLicence_1.drivingLicenceSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        image: joi_1.default.string().required().label("Image"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        aadhar: joi_1.default.string().required().label("Aadhar"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
//# sourceMappingURL=_validation.js.map