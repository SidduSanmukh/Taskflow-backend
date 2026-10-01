import { Request, Response, NextFunction } from "express";

export const healthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // res.status(200).json({ Message: "Hello from healthMiddleware" });
  const token = req.headers.authorization;
  if(!token) res.status(401).json({ Message: "token not found" });
next()
};
