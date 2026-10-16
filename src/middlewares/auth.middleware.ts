import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const getAccessSecret = (): string | undefined => {
  return process.env.JWT_ACCESS_SECRET;
};

export interface AuthenticationRequest extends Request {
  user?: {
    id: string;
  };
}

export const protect = (req: AuthenticationRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(400).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const token = authorization.slice("Bearer ".length);
  const secret = getAccessSecret();

  if (!secret) {
    console.log("JWT_ACCESS_SECRET is not configured");
    return res.status(500).json({
      success: false,
      message: "Server configuration error.",
    });
  }
  try {
    const payload = jwt.verify(token, secret, {
      issuer: "taskflow-api",
      audience: "taskflow-client",
    });
    if (typeof payload === "string" || typeof payload.sub !== "string") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }
    req.user = {
      id: payload.sub,
    };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token.",
    });
  }
};
