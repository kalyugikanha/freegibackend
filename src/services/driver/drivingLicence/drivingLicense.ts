import { Request, Response } from "express";
import { DrivingLicence, validateAdd, validateUpdate } from "./_validation";
import _ from "lodash";
import { fileUpload } from "../../../helper/upload";

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: { data: error?.message.replace(/\"/g, "").toString() } });

  let driving: any = new DrivingLicence(_.pick(req.body, ["image"]));
  driving.userId = req.body.cid;
  driving = await driving.save();

  res
    .status(200)
    .json({ message: "Driving License verified request successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: { data: error?.message.replace(/\"/g, "").toString() } });

  let drivingLicense: any = await DrivingLicence.findOne({
    userId: req.body.cid,
  });
  if (!drivingLicense)
    return res.status(400).json({ message: "No record found." });

  if (req.body.aadhar) drivingLicense.aadhar = req.body.aadhar;

  drivingLicense = await drivingLicense.save();

  res
    .status(200)
    .json({ message: "Aadhar card verified request successfully." });
};

export const uploadImage = async (req: Request, res: Response) => {
  await fileUpload(req, res, async (err: any) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.body.filename)
      return res.status(400).json({ message: "Please select the file." });

    res.status(200).json({
      message: "File uploaded successfully.",
      data: {
        filename: req.body.filename,
      },
    });
  });
};

// export const deleteImage = async (req: Request, res: Response) => {
//     if (!req.body.filename || req.body.filename === '') return res.status(400).json({ message: "File is not selected." });

//     await fileDelete(req.body.filename);
//     res.status(200).json({ message: "File deleted successfully." });

// };
