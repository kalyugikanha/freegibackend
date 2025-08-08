import { Request, Response } from "express";
import { Users } from "./_validation";

export const view = async (req: Request, res: Response) => {
  let users: any = await Users.findOne({ _id: req.body.cid }).select({
    password: 0,
    otp: 0,
  });
  if (!users) return res.status(400).json({ message: "No record found." });

  res.status(200).json({ data: users });
};
