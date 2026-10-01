import { Request, Response } from "express";

export const createTask = async (req: Request, res: Response) => {
    const tasks = req.body()
    if(!tasks) return res.status(500).json({message:"create Task error"})
    return res.status(201).json({message:"post created successfully"})
}

export const getAlltasks = async (req: Request, res: Response) => {
  const tasks = req.body();

  return res.status(200).json({ tasks: tasks });
};
