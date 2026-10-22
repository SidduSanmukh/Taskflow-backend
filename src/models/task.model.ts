import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface ITask {
  title: string;
  description?: string;
  completed: boolean;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type taskDocument = HydratedDocument<ITask>;

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const TaskModel = model<ITask>("Task", taskSchema);
