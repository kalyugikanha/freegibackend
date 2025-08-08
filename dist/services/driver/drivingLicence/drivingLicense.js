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
exports.uploadImage = exports.update = exports.add = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const upload_1 = require("../../../helper/upload");
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        return res
            .status(400)
            .json({ error: { data: error === null || error === void 0 ? void 0 : error.message.replace(/\"/g, "").toString() } });
    let driving = new _validation_1.DrivingLicence(lodash_1.default.pick(req.body, ["image"]));
    driving.userId = req.body.cid;
    driving = yield driving.save();
    res
        .status(200)
        .json({ message: "Driving License verified request successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        return res
            .status(400)
            .json({ error: { data: error === null || error === void 0 ? void 0 : error.message.replace(/\"/g, "").toString() } });
    let drivingLicense = yield _validation_1.DrivingLicence.findOne({
        userId: req.body.cid,
    });
    if (!drivingLicense)
        return res.status(400).json({ message: "No record found." });
    if (req.body.aadhar)
        drivingLicense.aadhar = req.body.aadhar;
    drivingLicense = yield drivingLicense.save();
    res
        .status(200)
        .json({ message: "Aadhar card verified request successfully." });
});
exports.update = update;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, upload_1.fileUpload)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(400).json({ message: err.message });
        if (!req.body.filename)
            return res.status(400).json({ message: "Please select the file." });
        res.status(200).json({
            message: "File uploaded successfully.",
            data: {
                filename: req.body.filename,
            },
        });
    }));
});
exports.uploadImage = uploadImage;
// export const deleteImage = async (req: Request, res: Response) => {
//     if (!req.body.filename || req.body.filename === '') return res.status(400).json({ message: "File is not selected." });
//     await fileDelete(req.body.filename);
//     res.status(200).json({ message: "File deleted successfully." });
// };
//# sourceMappingURL=drivingLicense.js.map