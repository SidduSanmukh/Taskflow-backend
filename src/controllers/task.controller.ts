import { Request, Response } from "express";
import {
  createTaskService,
  getTasksService,
  getTaskService,
} from "../services/task.service";
import { AuthenticationRequest } from "../middlewares/auth.middleware";

export const handleHealthCheck = async (req: Request, res: Response) => {
  const headers = req.headers.authorization;

  res
    .status(200)
    .json({ Message: "Server health is good to work", headers: headers });
};

// //Cookie
// export const handleCookieSet = async (req: Request, res: Response) => {
//   const token = req.headers.authorization;
//   res.cookie("Cookie", token);
//   res.status(200).json({ Message: "Cookie set" });
// };
// export const handleCookieDelete = async (req: Request, res: Response) => {
//   res.clearCookie("name", { httpOnly: true });
//   res.status(200).json({ Message: "Cookie Deleted" });
// };
// export const handleGetCookie = async (req: Request, res: Response) => {
//   res.status(200).json(req.cookies);
// };

//Tasks
export const handleCreateTasks = async (
  req: AuthenticationRequest,
  res: Response,
) => {
  try {
    const { title, description } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const data = await createTaskService(title, description, userId);
    console.log(data);

    return res.status(201).json({
      success: true,
      Message: "Task Created Successfully",
      task: data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task.",
    });
  }
};

export const handleGetTasks = async (
  req: AuthenticationRequest,
  res: Response,
) => {
  const userId = req.user?.id;

  if (typeof userId !== "string") {
    return res.status(400).json({ message: "Invalid userId" });
  }
  const tasks = await getTasksService(userId);

  return res.status(200).json(tasks);
};

export const handleGetTask = async (
  req: AuthenticationRequest,
  res: Response,
) => {
  const taskId  = req.params.id;
  const userId = req.user?.id;
  if (!taskId || !userId) {
    return res.status(400).json({ message: "Task or user ID not found" });
  }

  console.log(taskId)
  const task = await getTaskService(taskId as string, userId as string);

  if (!task) return res.status(400).json({ message: "Task not found" });

  return res.status(200).json(task);
};

export const updateTask = async (req: AuthenticationRequest, res: Response) => {
  const userId = req.user?.id;
  const { taskId } = req.params;
};
