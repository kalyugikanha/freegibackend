"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.fileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const config_1 = __importDefault(require("config"));
const fileSizeLimit = 100 * 1024 * 1024;
const acceptedImageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "JPG",
    "JPEG",
    "PNG",
];
const upload = (0, multer_1.default)({
    limits: {
        fileSize: fileSizeLimit,
    },
    fileFilter: (req, file, cb) => {
        if (acceptedImageExtensions.some((ext) => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        }
        return cb(new Error("Only " + acceptedImageExtensions.join(", ") + " files are allowed!"));
    },
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            let path = config_1.default.get("file.path");
            cb(null, path);
        },
        filename: function (req, file, cb) {
            let i = file.originalname.lastIndexOf(".");
            let ext = i < 0 ? ".jpg" : file.originalname.substring(i);
            cb(null, new Date().getTime().toString() + ext);
        },
    }),
});
const fileUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadFile = upload.single("file");
    yield uploadFile(req, res, (error) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return next(error);
        }
        if (!req.file)
            return res.status(400).json({ message: "File uploading failed." });
        let body = {
            file: req.file,
            filename: req.file.filename,
        };
        const { uploadFile } = yield Promise.resolve().then(() => __importStar(require("./firebaseConfig")));
        let result = yield uploadFile(body);
        if (result == null)
            return res.status(400).json({ message: "File uploading failed." });
        if (result != null) {
            fs.unlinkSync(req.file.path);
            req.body.filename = result;
            next();
        }
    }));
});
exports.fileUpload = fileUpload;
// import multer from "multer";
// import * as fs from "fs";
// import path from "path";
// import { Request, Response, NextFunction } from "express";
// import config from "config";
// // Set up multer storage and file handling
// const storage = multer.diskStorage({
//   destination: (req: Request, file: any, cb: any) => {
//     const uploadPath: string = String(config.get("file.path"));
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req: Request, file: any, cb: any) => {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   },
// });
// const upload = multer({
//   storage,
//   limits: { fileSize: 100 * 1024 * 1024 },
// }).fields([{ name: "image" }, { name: "imageList",maxCount:20 }]);
// export const fileUpload = async (req: Request, res: Response, next: NextFunction) => {
//   // Use multer for handling file uploads
//   upload(req, res, (err: any) => {
//     // Handle errors from multer
//     if (err) {
//       return res.status(400).json({ message: err.message });
//     }
//     // Proceed to next middleware or route handler
//     next();
//   });
// };
//# sourceMappingURL=upload.js.map