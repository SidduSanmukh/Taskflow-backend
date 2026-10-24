import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  createTaskService,
  getTasksService,
  getTaskService,
  updateTaskService,
  deleteTaskService,
} from "../services/task.service";
import { AuthenticationRequest } from "../middlewares/auth.middleware";

const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
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

//Create Task
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
  try {
    const userId = req.user?.id;
    if (!isValidObjectId(userId as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id",
      });
    }

    if (typeof userId !== "string") {
      return res.status(400).json({ message: "Invalid userId" });
    }
    const tasks = await getTasksService(userId);

    return res.status(200).json(tasks);
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Tasksssss feach error", error: error });
  }
};

export const handleGetTask = async (
  req: AuthenticationRequest,
  res: Response,
) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.id;

    if (!isValidObjectId(taskId as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id",
      });
    }

    if (!taskId || !userId) {
      return res.status(400).json({ message: "Task or user ID not found" });
    }

    const task = await getTaskService(taskId as string, userId as string);

    if (!task) return res.status(400).json({ message: "Task not found" });

    return res.status(200).json(task);
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Task feach error", error: error });
  }
};

export const handleUpdateTask = async (
  req: AuthenticationRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const taskId = req.params.id;
    if (!isValidObjectId(taskId as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id",
      });
    }

    console.log(userId, "\n", taskId);
    if (!taskId || !userId)
      return res.status(400).json({ message: "Task or user Does not exist." });

    const { title, description, completed } = req.body;

    const updateTask = await updateTaskService(taskId as string, userId, {
      title,
      description,
      completed,
    });
    return res.status(200).json({
      success: true,
      message: "task successfylly updated.",
      updatedTask: updateTask,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Task update failed" });
  }
};

export const handleDeleteTask = async (
  req: AuthenticationRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const taskId = req.params.id;
    if (!isValidObjectId(taskId as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id",
      });
    }
    if (!userId || !taskId)
      return res
        .status(400)
        .json({ success: false, message: "task or user not found" });

    const deletedTask = await deleteTaskService(
      taskId as string,
      userId as string,
    );
    return res.status(200).json({
      success: true,
      message: "Task successfully deleted",
      task: deletedTask,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Task deletion error" });
  }
};
