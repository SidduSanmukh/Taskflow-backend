export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface createTaskInput {
  title: string;
  description?: string;
  userId: string;
}

export interface updateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
}
