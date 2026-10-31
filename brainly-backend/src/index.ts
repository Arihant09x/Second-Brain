import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log(
  "Loading environment variables from:",
  path.resolve(__dirname, "../.env")
);

import { env, requireGeminiApiKey } from "./environment";

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  ContentModel,
  LinkModel,
  LinksModel,
  UserModel,
  AIConversationModel,
  DocumentModel,
} from "./db";
import bcrypt from "bcryptjs";

import cors from "cors";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { usermiddleware } from "./middleware/User";
import { random } from "./utils";
import axios from "axios";

// Environment Variables
const mongoUri = env.MONGO_URI!;
const JWT_SECRET = env.JWT_SECRET!;
const GEMINI_API_KEY = env.GEMINI_API_KEY!;
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

// File upload configuration
const storage = multer.diskStorage({
  destination: (req: any, file: Express.Multer.File, cb: any) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file: Express.Multer.File, cb: any) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, PPT, DOC, XLS, and TXT files are allowed."
        )
      );
    }
  },
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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

const aiQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  context: z.string().optional(),
  apiKey: z.string().min(1, "Gemini API key is required"),
});

interface User {
  _id: string;
  user: string;
  name: string;
  username: string;
  password: string;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Gemini AI integration function
async function askGeminiAI(
  question: string,
  apiKey: string,
  userContent?: any[]
): Promise<string> {
  try {
    // Initialize Gemini AI with the user key
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Build context from user's content
    let contextString = "";
    if (userContent && userContent.length > 0) {
      const context = userContent[0];

      if (context.content && context.content.length > 0) {
        contextString += "\n\nUser's Content:\n";
        context.content.forEach((item: any, index: number) => {
          contextString += `${index + 1}. ${item.title || "Untitled"}\n`;
          if (item.subtitle)
            contextString += `   Description: ${item.subtitle}\n`;
          if (item.link) contextString += `   Link: ${item.link}\n`;
          if (item.type) contextString += `   Type: ${item.type}\n`;
        });
      }

      if (context.links && context.links.length > 0) {
        contextString += "\n\nUser's Links:\n";
        context.links.forEach((link: any, index: number) => {
          contextString += `${index + 1}. ${link.title || "Untitled Link"}\n`;
          if (link.url) contextString += `   URL: ${link.url}\n`;
        });
      }

      if (context.documents && context.documents.length > 0) {
        contextString += "\n\nUser's Documents:\n";
        context.documents.forEach((doc: any, index: number) => {
          contextString += `${index + 1}. ${
            doc.title || doc.fileName || "Untitled Document"
          }\n`;
          if (doc.description)
            contextString += `   Description: ${doc.description}\n`;
          if (doc.fileType) contextString += `   Type: ${doc.fileType}\n`;
        });
      }
    }

    // Create the prompt with context
    const selectedContextInfo =
      userContent && userContent.length > 0 && userContent[0].selectedContext
        ? `\n\nNote: The user has specifically selected to include: ${userContent[0].selectedContext}`
        : "";

    const prompt = `You are an AI assistant helping a user with their "Second Brain" - a personal knowledge management system. The user has asked: "${question}"

${contextString}${selectedContextInfo}

Please provide a helpful, detailed response based on the user's question and their available content. If the user's content is relevant to their question, reference it specifically. If not, provide general helpful information related to their question.

Be conversational, helpful, and specific. If you reference any of the user's content, mention it by name. Keep your response informative but not overly long.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error calling Gemini AI:", error);
    return "Sorry, I encountered an error while processing your request. Please try again.";
  }
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
      const hashpassword = await bcrypt.hash(password, 10);

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
    res.status(500).json({ msg: "Server crached", error: error });
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
      const isMatcg = await bcrypt.compare(password, user.password!);
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

// Add this new route in your server.ts file, for example, after your signin route.

app.post("/api/v1/auth/google", async (req: Request, res: Response) => {
  try {
    const { token } = req.body; // The access_token from the frontend

    if (!token) {
      res.status(400).json({ msg: "Google token is required." });
      return;
    }

    // 1. Verify the token by fetching user info from Google
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const profile: any = response.data;
    const googleId = profile.sub; // Google's unique user ID
    if (!googleId) {
      res.status(400).json({ msg: "Invalid Google token." });
      return;
    }
    const email = profile.email;
    const username = email.split("@")[0]; // Create a username from the email

    // 2. Find or create the user in your database
    let user = await UserModel.findOne({ googleId: googleId });

    if (!user) {
      // If user doesn't exist, create a new one
      user = await UserModel.create({
        googleId: googleId,
        username: username,
      });
    }

    // 3. Create YOUR OWN JWT for this user
    const internalToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d", // Optional: set an expiration
    });

    // 4. Send your internal JWT and user data back to the frontend
    res.status(200).json({
      msg: "Google sign-in successful",
      token: internalToken,
      user: {
        id: user._id,
        googleId: user.googleId,
        username: user.username,
        profilePic: profile.picture,
      },
    });
  } catch (error) {
    console.error("Error during Google OAuth:", error);
    res.status(401).json({ msg: "Invalid Google token or failed to process." });
  }
});

// AI Routes
app.post(
  "/api/v1/ai/ask",
  usermiddleware,
  async (req: Request, res: Response) => {
    try {
      const {
        question,
        context: selectedContext,
        apiKey,
      } = aiQuestionSchema.parse(req.body);

      // Get user's content for context
      let userContent = await ContentModel.find({ UserId: req.userId });
      let userLinks = await LinksModel.find({ UserId: req.userId });
      let userDocuments = await DocumentModel.find({ UserId: req.userId });

      // Filter content based on selected context types if provided
      if (selectedContext) {
        const selectedTypes = selectedContext
          .split(",")
          .map((s) => s.trim().toLowerCase());

        // Filter Documents
        if (!selectedTypes.includes("documents")) {
          userDocuments = [];
        }

        // Filter Links from the dedicated LinksModel
        if (!selectedTypes.includes("links")) {
          userLinks = [];
        }

        // Filter the general `ContentModel` which stores items with a 'type' property
        // like 'youtube', 'twitter', 'linkedin', 'reddits'.
        userContent = userContent.filter((item: any) => {
          if (item.type) {
            // Check if the item's type is one of the selected types
            return selectedTypes.includes(item.type.toLowerCase());
          }
          return false; // If an item has no type, don't include it in a filtered search
        });
      }

      // Create context from user's data
      const context = {
        content: userContent,
        links: userLinks,
        documents: userDocuments,
        selectedContext: selectedContext || "all content types",
      };

      // Get AI response
      const answer = await askGeminiAI(question, apiKey, [context]);

      // Save conversation to database
      const conversation = await AIConversationModel.create({
        question,
        answer,
        UserId: req.userId,
      });

      res.status(200).json({
        id: conversation._id,
        question: conversation.question,
        answer: conversation.answer,
        timestamp: conversation.timestamp,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          msg: "Validation error",
          errors: error.errors.map((err) => err.message),
        });
        return;
      }
      console.error("Error in AI ask route:", error);
      res.status(500).json({ msg: "An unexpected server error occurred" });
    }
  }
);

app.get(
  "/api/v1/ai/conversations",
  usermiddleware,
  async (req: Request, res: Response) => {
    try {
      const conversations = await AIConversationModel.find({
        UserId: req.userId,
      })
        .sort({ timestamp: -1 })
        .limit(50);

      res.status(200).json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ msg: "An unexpected server error occurred" });
    }
  }
);

// Document Routes
app.post(
  "/api/v1/documents/upload",
  usermiddleware,
  upload.single("document"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ msg: "No file uploaded" });
        return;
      }

      const { title, description } = req.body;
      const file = req.file;

      const document = await DocumentModel.create({
        title: title || file.originalname,
        fileName: file.originalname,
        fileType: path.extname(file.originalname).substring(1).toLowerCase(),
        fileSize: file.size,
        filePath: file.path,
        description: description || "",
        UserId: req.userId,
      });

      res.status(201).json({
        msg: "Document uploaded successfully",
        document: {
          _id: document._id,
          title: document.title,
          fileName: document.fileName,
          fileType: document.fileType,
          fileSize: document.fileSize,
          description: document.description,
          uploadDate: document.uploadDate,
        },
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ msg: "An unexpected server error occurred" });
    }
  }
);

app.get(
  "/api/v1/documents",
  usermiddleware,
  async (req: Request, res: Response) => {
    try {
      const documents = await DocumentModel.find({ UserId: req.userId });

      res.status(200).json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ msg: "An unexpected server error occurred" });
    }
  }
);

app.get(
  "/api/v1/documents/:id/download",
  usermiddleware,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const document = await DocumentModel.findOne({
        _id: id,
        UserId: req.userId,
      });

      if (!document) {
        res.status(404).json({ msg: "Document not found" });
        return;
      }

      if (!fs.existsSync(document.filePath)) {
        res.status(404).json({ msg: "File not found on server" });
        return;
      }

      res.download(document.filePath, document.fileName);
    } catch (error) {
      console.error("Error downloading document:", error);
      res.status(500).json({ msg: "An unexpected server error occurred" });
    }
  }
);

app.delete(
  "/api/v1/documents/:id",
  usermiddleware,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const document = await DocumentModel.findOne({
        _id: id,
        UserId: req.userId,
      });

      if (!document) {
        res.status(404).json({ msg: "Document not found" });
        return;
      }

      // Delete file from filesystem
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }

      // Delete from database
      await DocumentModel.deleteOne({ _id: id, UserId: req.userId });

      res.status(200).json({ msg: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ msg: "An unexpected server error occurred" });
    }
  }
);

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
  "/api/v1/content/:id",
  usermiddleware,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ msg: "Content ID is required" });
        return;
      }

      const deleteResult = await ContentModel.deleteOne({
        _id: id, // Assuming contentId is the `_id` of the content
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
