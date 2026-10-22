import { Schema,model } from "mongoose";

export interface Iuser {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}


const userSchema = new Schema<Iuser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,

    },
    passwordHash: {
      type: String,
      required: true,
      select:false
    },
  },

  {
    timestamps: true,
  },
);


export const userModel = model<Iuser>("User",userSchema)