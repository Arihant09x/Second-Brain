import dotenv from "dotenv";
import path from "path";

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log(
  "Loading environment variables from:",
  path.resolve(__dirname, "../.env")
);

import { env } from "./environment";

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { ContentModel, LinkModel, LinksModel, UserModel } from "./db";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { usermiddleware } from "./middleware/User";
import { random } from "./utils";

// Environment Variables
const mongoUri = env.MONGO_URI!;
const JWT_SECRET = env.JWT_SECRET!;
if (!mongoUri || !JWT_SECRET) {
  console.error("Environment variables not loaded correctly");
  console.error("MONGO_URI:", mongoUri ? "***" : "MISSING");
  console.error("JWT_SECRET:", JWT_SECRET ? "***" : "MISSING");
  throw new Error(
    "Environment variables MONGO_URI and JWT_SECRET are required."
  );
}

// App Setup
const app = express();
app.use(cors());
app.use(express.json());

// Zod Schemas
const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(10, "Username must not exceed 10 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must not exceed 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),
});

const signinSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(10, "Username must not exceed 10 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must not exceed 20 characters"),
});

interface User {
  _id: string;
  user: string;
  name: string;
  username: string;
  password: string;
}

// Signup Route
app.post("/api/v1/signup", async (req, res) => {
  try {
    const { username, password } = signupSchema.parse(req.body);
    const user = await UserModel.findOne({ username: username });
    if (user) {
      res.status(400).json({ msg: "Username taken" });
      return;
    } else {
      const hashpassword = await bcrypt.hash(password, 5);
      await UserModel.create({ username: username, password: hashpassword });
      res.status(201).json({ msg: "User Created Successfully" });
      return;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        msg: "Validation Error",
        error: error.errors.map((err) => err.message),
      });
      return;
    }
    res.status(500).json({ msg: "Server crached" });
    return;
  }
});
app.post("/api/v1/signin", async (req, res) => {
  try {
    const { username, password } = signinSchema.parse(req.body);
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      res.status(400).json({ msg: "Username not SignUp" });
      return;
    } else {
      const isMatcg = await bcrypt.compare(password, user.password);
      if (isMatcg) {
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.status(200).json({ msg: "Login Success", token });
        return;
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        msg: "Validation error",
        errors: error.errors.map((err) => err.message),
      });
      return;
    }
    res.status(500).json({ msg: "Server Crached" });
    return;
  }
});
app.post(
  "/api/v1/content",
  usermiddleware,
  async (req: Request, res: Response) => {
    const { link, title, subtitle, type } = req.body;
    await ContentModel.create({
      link: link,
      type: type,
      title: title,
      subtitle: subtitle,
      UserId: req.userId,
      tags: [],
    });
    res.status(201).json({ msg: "Content created successfully" });
  }
);

app.get(
  "/api/v1/content",
  usermiddleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const content = await ContentModel.find({
      UserId: userId,
    }).populate("UserId", "username");
    res.status(200).json(content);
  }
);
app.delete(
  "/api/v1/content",
  usermiddleware,
  async (req: Request, res: Response) => {
    try {
      const { contentId } = req.body;

      if (!contentId) {
        res.status(400).json({ msg: "Content ID is required" });
        return;
      }

      const deleteResult = await ContentModel.deleteOne({
        _id: contentId, // Assuming contentId is the `_id` of the content
        UserId: req.userId, // Verifying the user owns the content
      });

      if (deleteResult.deletedCount > 0) {
        res.status(200).json({ msg: "Content deleted successfully" });
        return;
      } else {
        res.status(404).json({ msg: "Content not found or not authorized" });
        return;
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ msg: "An unexpected server error occurred" });
      return;
    }
  }
);
app.post(
  "/api/v1/links",
  usermiddleware,
  async (req: Request, res: Response) => {
    try {
      const { title, url } = req.body;

      await LinksModel.create({
        title: title,
        url: url,
        UserId: req.userId,
      });
      res.status(201).json({ msg: "Link created successfully" });
    } catch (error) {
      console.error("Error creating link:", error);
      res.status(500).json({ msg: "An unexpected server error occurred" });
    }
  }
);

app.get(
  "/api/v1/links",
  usermiddleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const links = await LinksModel.find({
      UserId: userId,
    }).populate("UserId", "username");
    res.status(200).json(links);
  }
);

app.delete(
  "/api/v1/links/:id",
  usermiddleware,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ msg: "Link ID is required" });
        return;
      }

      const deleteResult = await LinksModel.deleteOne({
        _id: id, // Assuming id is the `_id` of the link
        UserId: req.userId, // Verifying the user owns the link
      });

      if (deleteResult.deletedCount > 0) {
        res.status(200).json({ msg: "Link deleted successfully" });
        return;
      } else {
        res.status(404).json({ msg: "Link not found or not authorized" });
        return;
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      res.status(500).json({ msg: "An unexpected server error occurred" });
      return;
    }
  }
);

app.post(
  "/api/v1/brain/share",
  usermiddleware,
  async (req: Request, res: Response) => {
    try {
      const share = req.body.share;

      if (share) {
        // Check if a link already exists for the user
        let existingLink = await LinkModel.findOne({ UserId: req.userId });

        if (existingLink) {
          // Return the existing hash
          res.status(200).json({
            msg: "Link retrieved successfully",
            link: existingLink.hash,
          });
        } else {
          // Create a new hash and save it
          const hash = random(10);
          const newLink = await LinkModel.create({
            UserId: req.userId,
            hash: hash,
          });
          res
            .status(200)
            .json({ msg: "Link created successfully", link: newLink.hash });
        }
      } else {
        // If share is false, delete the link for the user
        await LinkModel.deleteOne({ UserId: req.userId });
        res.status(200).json({ msg: "Link deleted successfully" });
      }
    } catch (e) {
      res.status(500).json({ msg: "An unexpected server error occurred" });
    }
  }
);

app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {
  try {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
      hash: hash,
    });
    if (!link) {
      res.status(404).json({ msg: "Link not found" });
    } else {
      const content = await ContentModel.find({
        UserId: link.UserId,
      });
      const User = await UserModel.findOne({
        _id: link.UserId,
      });
      if (!User) {
        res.status(404).json({ msg: "User not found" });
        return;
      }
      res.status(201).json({
        Username: User.username, //(?) if user does not exist
        Content: content,
      });
    }
  } catch (e) {
    res.status(500).json({ msg: "An unexpected server error occurred" });
  }
});
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
    app.listen(5000, () => console.log("Server running on port 5000"));
  } catch (error: any) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();
