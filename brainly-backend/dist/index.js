"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from root directory
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
console.log("Loading environment variables from:", path_1.default.resolve(__dirname, "../.env"));
const environment_1 = require("./environment");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const User_1 = require("./middleware/User");
const utils_1 = require("./utils");
// Environment Variables
const mongoUri = environment_1.env.MONGO_URI;
const JWT_SECRET = environment_1.env.JWT_SECRET;
if (!mongoUri || !JWT_SECRET) {
    console.error("Environment variables not loaded correctly");
    console.error("MONGO_URI:", mongoUri ? "***" : "MISSING");
    console.error("JWT_SECRET:", JWT_SECRET ? "***" : "MISSING");
    throw new Error("Environment variables MONGO_URI and JWT_SECRET are required.");
}
// App Setup
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use(express_1.default.json());
// Zod Schemas
const signupSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(10, "Username must not exceed 10 characters"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(20, "Password must not exceed 20 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
});
const signinSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(10, "Username must not exceed 10 characters"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(20, "Password must not exceed 20 characters"),
});
// Signup Route
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = signupSchema.parse(req.body);
        const user = yield db_1.UserModel.findOne({ username: username });
        if (user) {
            res.status(400).json({ msg: "Username taken" });
            return;
        }
        else {
            const hashpassword = yield bcryptjs_1.default.hash(password, 10);
            yield db_1.UserModel.create({ username: username, password: hashpassword });
            res.status(201).json({ msg: "User Created Successfully" });
            return;
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                msg: "Validation Error",
                error: error.errors.map((err) => err.message),
            });
            return;
        }
        res.status(500).json({ msg: "Server crached" });
        return;
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = signinSchema.parse(req.body);
        const user = yield db_1.UserModel.findOne({ username: username });
        if (!user) {
            res.status(400).json({ msg: "Username not SignUp" });
            return;
        }
        else {
            const isMatcg = yield bcryptjs_1.default.compare(password, user.password);
            if (isMatcg) {
                const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET);
                res.status(200).json({ msg: "Login Success", token });
                return;
            }
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                msg: "Validation error",
                errors: error.errors.map((err) => err.message),
            });
            return;
        }
        res.status(500).json({ msg: "Server Crached" });
        return;
    }
}));
app.post("/api/v1/content", User_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, title, subtitle, type } = req.body;
    yield db_1.ContentModel.create({
        link: link,
        type: type,
        title: title,
        subtitle: subtitle,
        UserId: req.userId,
        tags: [],
    });
    res.status(201).json({ msg: "Content created successfully" });
}));
app.get("/api/v1/content", User_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({
        UserId: userId,
    }).populate("UserId", "username");
    res.status(200).json(content);
}));
app.delete("/api/v1/content", User_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contentId } = req.body;
        if (!contentId) {
            res.status(400).json({ msg: "Content ID is required" });
            return;
        }
        const deleteResult = yield db_1.ContentModel.deleteOne({
            _id: contentId, // Assuming contentId is the `_id` of the content
            UserId: req.userId, // Verifying the user owns the content
        });
        if (deleteResult.deletedCount > 0) {
            res.status(200).json({ msg: "Content deleted successfully" });
            return;
        }
        else {
            res.status(404).json({ msg: "Content not found or not authorized" });
            return;
        }
    }
    catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ msg: "An unexpected server error occurred" });
        return;
    }
}));
app.post("/api/v1/links", User_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, url } = req.body;
        yield db_1.LinksModel.create({
            title: title,
            url: url,
            UserId: req.userId,
        });
        res.status(201).json({ msg: "Link created successfully" });
    }
    catch (error) {
        console.error("Error creating link:", error);
        res.status(500).json({ msg: "An unexpected server error occurred" });
    }
}));
app.get("/api/v1/links", User_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const links = yield db_1.LinksModel.find({
        UserId: userId,
    }).populate("UserId", "username");
    res.status(200).json(links);
}));
app.delete("/api/v1/links/:id", User_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ msg: "Link ID is required" });
            return;
        }
        const deleteResult = yield db_1.LinksModel.deleteOne({
            _id: id, // Assuming id is the `_id` of the link
            UserId: req.userId, // Verifying the user owns the link
        });
        if (deleteResult.deletedCount > 0) {
            res.status(200).json({ msg: "Link deleted successfully" });
            return;
        }
        else {
            res.status(404).json({ msg: "Link not found or not authorized" });
            return;
        }
    }
    catch (error) {
        console.error("Error deleting link:", error);
        res.status(500).json({ msg: "An unexpected server error occurred" });
        return;
    }
}));
app.post("/api/v1/brain/share", User_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const share = req.body.share;
        if (share) {
            // Check if a link already exists for the user
            let existingLink = yield db_1.LinkModel.findOne({ UserId: req.userId });
            if (existingLink) {
                // Return the existing hash
                res.status(200).json({
                    msg: "Link retrieved successfully",
                    link: existingLink.hash,
                });
            }
            else {
                // Create a new hash and save it
                const hash = (0, utils_1.random)(10);
                const newLink = yield db_1.LinkModel.create({
                    UserId: req.userId,
                    hash: hash,
                });
                res
                    .status(200)
                    .json({ msg: "Link created successfully", link: newLink.hash });
            }
        }
        else {
            // If share is false, delete the link for the user
            yield db_1.LinkModel.deleteOne({ UserId: req.userId });
            res.status(200).json({ msg: "Link deleted successfully" });
        }
    }
    catch (e) {
        res.status(500).json({ msg: "An unexpected server error occurred" });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = req.params.shareLink;
        const link = yield db_1.LinkModel.findOne({
            hash: hash,
        });
        if (!link) {
            res.status(404).json({ msg: "Link not found" });
        }
        else {
            const content = yield db_1.ContentModel.find({
                UserId: link.UserId,
            });
            const User = yield db_1.UserModel.findOne({
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
    }
    catch (e) {
        res.status(500).json({ msg: "An unexpected server error occurred" });
    }
}));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(mongoUri);
        console.log("MongoDB connected successfully");
        app.listen(5000, () => console.log("Server running on port 5000"));
    }
    catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
});
connectDB();
