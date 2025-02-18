import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { env } from "../environment";

// Load environment variables
dotenv.config();

const JWT_SECRET = env.JWT_SECRET;

// Extend the Request interface to include `userId`
declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

export const usermiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({ msg: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (decoded && typeof decoded === "object" && "id" in decoded) {
      req.userId = decoded.id as string;
      next();
    } else {
      res.status(401).json({ msg: "Invalid token payload" });
      return;
    }
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
    return;
  }
};
