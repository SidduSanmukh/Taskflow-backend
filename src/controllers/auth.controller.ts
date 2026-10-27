import { Request, Response } from "express";
import { registerService, loginService } from "../services/auth.service";
import { AuthenticationRequest } from "../middlewares/auth.middleware";
import { userModel } from "../models/user.model";

//get user 
export const getMe = async(req:AuthenticationRequest, res:Response) => {
  
  try {
    const user = await userModel.findById(req.user?.id).select("name email createdAt")
    if (!user) {
      return res.status(401).json({
        success: false,
        message:"User account not found."
      })
    }

    return res.status(200).json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error("Featching current user failed:", error)

    return res.status(500).json({
      success: false,
      message:"unable to fetch current user."
    })
  }
}

//create user
export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, valid email input, and a password of at least 8 characters are required",
      });
    }

    const result = registerService(name, email, password);

    return res.status(201).json({
      success: true,
      message: "User created",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_REGISTERED"
    ) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }
    console.error("Registeration Failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to register User",
    });
  }
};

//login user
export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "valid email input, and a password of at least 8 characters are required",
      });
    }

    const result = await loginService(email, password);

    console.log(result)
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID CREDENTIALS") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    console.error("Login failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
};
