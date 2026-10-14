import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model";

const getAccessSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) throw new Error("JWT_ACCESS_SECRET is not configured");

  return secret;
};

const createAccessToken = (userId: string): string => {
  return jwt.sign(
    {},
    getAccessSecret(),
    {
      subject: userId,
      expiresIn: "15m",
      issuer: "taskflow-api",
      audience: "taskflow-client",
    },
  );
};


export const registerService = async (name:string, email:string, password:string) => {
    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await userModel.findOne({ email: normalizedEmail })
    
    if (existingUser) {
        throw new Error("EMAIL_ALREADY_REGISTERED")
    }

    const passwordHash = await bcrypt.hash(password, 12)
    
    const user = await userModel.create({
        name:name.trim(),
        email: normalizedEmail,
        passwordHash
    })

    const accessToken = createAccessToken(user.id)

    return {
        user: {
            id: user.id,
            name: user.name,
            email:user.email
        },
        accessToken
    }
}

export const loginService = async (email:string, password:string) => {
    const normalizedEmail = email.trim().toLowerCase()
    

    const user = await userModel.findOne({ email: normalizedEmail }).select("+passwordHash")
    
    if (!user) {
        throw new Error("INVALID CREDENTIALS")
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatches) {
        throw new Error("INVALID CREDENTIALS")
    }

    const accessToken = createAccessToken(user.id)

    return {
        user: {
            id: user.id,
            name:user.name,
            email:user.email
        },
        accessToken,
    }
}
