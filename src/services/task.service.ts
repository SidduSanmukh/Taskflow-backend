// import { Task, createTaskInput, updateTaskInput } from "../types/task.types";

// const tasks: Task[] = [];

// export const createTaskService = (input: createTaskInput): Task => {
//   const now = new Date();

//   const task: Task = {
//     id: crypto.randomUUID(),
//     title: input.title,
//     description: input.description ?? "",
//     completed: false,
//     userId: input.userId,
//     createdAt: now,
//     updatedAt: now,
//   };

//   tasks.push(task);

//   return task;
// };

// //get all tasks
// export const getTasksService = (userId: string) => {
//   console.log(tasks.filter(task => task.userId === userId));
//   return userId!=tasks[0].userId
//     ? "user not found"
//     : tasks.filter(task => task.userId === userId);
// };

// //Get one task
// export const getTaskService = (
//   taskId: string,
//   userId: string,
// ): Task | undefined => {
//   return tasks.find(task => taskId === task.id && userId === task.userId);
// };

// //update Task
// export const updateTaskService = (
//   taskId: string,
//   userId: string,
//   input: updateTaskInput,
// ): Task | undefined => {
//   const task = tasks.find(task => taskId == task.id && userId == task.userId);

//   if (!task) {
//     return undefined;
//   }

//   if (task.title != undefined) task.title = input.title ?? "";

//   if (task.description != undefined) task.description = input.description ?? "";

//   if (task.completed != undefined) task.completed = input.completed ?? false;

//   task.updatedAt = new Date();

//   return task;
// };

// //delete Task
// export const deleteTaskService = (taskId: string, userId: string): boolean => {
//   const index = tasks.findIndex(
//     task => taskId === task.id && userId === task.userId,
//   );

//   tasks.splice(index, 1);

//   return true;
// };

import { taskDocument, TaskModel } from "../models/task.model";

export const createTaskService = async (
  title: string,
  description: string,
): Promise<taskDocument> => {
  const taskData = await TaskModel.create({
    title,
    description,
  });
  return taskData;
};

export const getTasksService = async (userId: string) => {
  const tasks = await TaskModel.find({ userId });
  if (tasks.length == 0) return [];

  return tasks;
};

export const getTaskService = async (taskId: string, userId: string) => {
  const task = await TaskModel.findOne({ taskId, userId });

  if (tasks.length == 0) return [];

  return task;
};
