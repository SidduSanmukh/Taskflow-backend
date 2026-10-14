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

//Cookie
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
  res.status(200).json(req.cookies);
};

//Tasks

export const handleCreateTasks = async (req: Request, res: Response) => {
  const tasks = req.body;

  if (!tasks) {
    return res.status(400).json("create the tasks first");
  }

  const data = await createTaskService(tasks);
  console.log(data);

  return res.status(200).json({ message: "Task Created Successfully" });
};

// export const handleGetTasks = async (req: Request, res: Response) => {
//   const { userId } = req.query;

//   if (typeof userId !== "string") {
//     return res.status(400).json({ message: "Invalid userId" });
//   }
//   const tasks = await getTasksService(userId);

//   return res.status(200).json(tasks);
// };

export const handleGetTask = async (req: Request, res: Response) => {

  const { taskId, userId } = req.query;
  if (!taskId || !userId) {
    return res.status(400).json({ message: "Task or user ID not found" });
  }

  const task = await getTaskService(taskId as string, userId as string);

  if (!task) return res.status(400).json({ message: "Task not found" });

  return res.status(200).json(task);

};

export const handleGetTasks = (req: Request, res: Response) => {
  const tasks = getTaskService()
  if(!tasks) return res.status(400).json({Message:"No tasks found"})
  
  return res.status(200).json(tasks)
}