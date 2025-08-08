import multer from "multer";
import * as fs from "fs";
import { NextFunction, Request, Response } from "express";
import config from "config";

const fileSizeLimit: number = 100 * 1024 * 1024;
const acceptedImageExtensions: Array<string> = [
  "jpg",
  "jpeg",
  "png",
  "JPG",
  "JPEG",
  "PNG",
];

const upload = multer({
  limits: {
    fileSize: fileSizeLimit,
  },
  fileFilter: (req, file, cb) => {
    if (
      acceptedImageExtensions.some((ext) =>
        file.originalname.endsWith("." + ext)
      )
    ) {
      return cb(null, true);
    }
    return cb(
      new Error(
        "Only " + acceptedImageExtensions.join(", ") + " files are allowed!"
      )
    );
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let path: any = config.get("file.path");
      cb(null, path);
    },
    filename: function (req, file, cb) {
      let i: number = file.originalname.lastIndexOf(".");
      let ext: string = i < 0 ? ".jpg" : file.originalname.substring(i);
      cb(null, new Date().getTime().toString() + ext);
    },
  }),
});

export const fileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uploadFile: any = upload.single("file");
  await uploadFile(req, res, async (error: any) => {
    if (error) {
      return next(error);
    }

    if (!req.file)
      return res.status(400).json({ message: "File uploading failed." });

    let body: any = {
      file: req.file,
      filename: req.file.filename,
    };
    const { uploadFile } = await import("./firebaseConfig");
    let result = await uploadFile(body);
    if (result == null)
      return res.status(400).json({ message: "File uploading failed." });
    if (result != null) {
      fs.unlinkSync(req.file.path);
      req.body.filename = result;
      next();
    }
  });
};






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
