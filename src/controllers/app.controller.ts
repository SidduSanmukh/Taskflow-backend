import { Request, Response } from "express";
import {
  createTaskService,
  getTasksService,
  getTaskService,
} from "../services/task.service";

export const handleHealthCheck = async (req: Request, res: Response) => {
  const headers = req.headers.authorization;

  res
    .status(200)
    .json({ Message: "Server health is good to work", headers: headers });
};

export const handleCookieSet = async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  res.cookie("Cookie", token);
  res.status(200).json({ Message: "Cookie set" });
};
export const handleCookieDelete = async (req: Request, res: Response) => {
  res.clearCookie("name", { httpOnly: true });
  res.status(200).json({ Message: "Cookie Deleted" });
};

export const handleGetCookie = async (req: Request, res: Response) => {
  res.status(200).json({ "cookie : ": req.cookies });
};

export const handleCreateTasks = async (req: Request, res: Response) => {
  const tasks = req.body;

  if (!tasks) {
    return res.status(400).json("create the tasks first");
  }

  await createTaskService(tasks);

  return res.status(200).json({ message: "Task Created Successfully" });
};

export const handleGetTasks = async (req: Request, res: Response) => {
  const userId = req.query.userId?.toString();
  if (!userId) {
    return res.status(402).json({ message: "user not found" });
  }
  await getTasksService(userId);
};

export const handleGetTask = async (req: Request, res: Response) => {
  const { taskId, userId } = req.query;

  if (taskId != "String" || userId != "String") {
    return res.status(401).json({ message: "taskId or userId is missing" });
  }

  await getTaskService(taskId, userId);
};
