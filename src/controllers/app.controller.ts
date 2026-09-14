import { Request, Response } from "express";

export const handleHealthCheck = async (req: Request, res: Response) => {
  res.status(200).json({ Message: "Server health is good to work" });
};
