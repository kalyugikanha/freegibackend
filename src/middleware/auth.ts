import config from "config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { decrypt } from "../helper/encription";
import { Users } from "../services/customer/login/_validation";

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string = req.headers["x-auth-token"] as string;
    if (!token)
      return res.status(401).json({ message: "Authentication failed!" });

    token = await decrypt(token);

    const decodedToken: any = jwt.verify(token, config.get("jwtPrivateKey"));
   
    console.log(decodedToken);
    

    let _id: string = decodedToken.cid ? decodedToken.cid : null;
    let storeId: string = decodedToken.storeId ? decodedToken.storeId : null;
    let users: any = await Users.findOne({ _id: _id });
    if (!users)
      return res.status(401).json({ message: "Authentication failed!" });
    req.body.storeId = storeId;
    req.body.cid = _id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed!" });
  }
};
