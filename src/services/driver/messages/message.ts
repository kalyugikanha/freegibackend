import { Request, Response } from "express";
import { Message } from "./_validation";

export const list = async (req: Request, res: Response) => {
  const message = await Message.find({
    chatId: req.body.chatId,
  })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: message });
};
