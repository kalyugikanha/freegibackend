import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      console.error("Error:", err); 
      res.status(200).json({
        action: false,
        message: err.message || "An error occurred.",
      });
    });
  };
};
