"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usermiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const environment_1 = require("../environment");
// Load environment variables
dotenv_1.default.config();
const JWT_SECRET = environment_1.env.JWT_SECRET;
const usermiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        res.status(401).json({ msg: "No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded && typeof decoded === "object" && "id" in decoded) {
            req.userId = decoded.id;
            next();
        }
        else {
            res.status(401).json({ msg: "Invalid token payload" });
            return;
        }
    }
    catch (error) {
        res.status(401).json({ msg: "Invalid token" });
        return;
    }
};
exports.usermiddleware = usermiddleware;
