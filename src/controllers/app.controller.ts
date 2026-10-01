import { Request, Response } from "express";
import { getAlltasks,createTask } from "../services/app.service";




export const createTsk = async (req: Request, res: Response) => {
  return res.status(200).json(tasks);
};


export const AllTasks = async (req: Request, res: Response) => {
  const tasks = await getAlltasks;
  return res.status(200).json(tasks);
};

export const handleHealthCheck = async (req: Request, res: Response) => {
  const headers = req.headers.authorization;

  res
    .status(200)
    .json({ Message: "Server health is good to work", headers: headers });
};

export const handleCookieSet = async (req: Request, res: Response) => {
  res.cookie("name", "SSS");
  res.status(200).json({ Message: "Cookie set" });
};

export const handleGetCookie = async (req: Request, res: Response) => {
  res.status(200).json({ "cookie : ": req.cookies });
};

export const handleCreateTasks = async (req: Request, res: Response) => {
  const tasks = req.body;
  if (!tasks) {
    return res.status(400).json("create the tasks first");
  }
  return res.status(200).json("task created successfully");
};

export const handleGetTasks = async (req: Request, res: Response) => {
  const tasks = req.body;
  if (!tasks) {
    return res.status(400).json("create the tasks first");
  }
  return res.status(200).json({ tasks: tasks });
};
