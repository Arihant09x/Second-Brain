"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    MONGO_URI: process.env.MONGO_URI ||
        "mongodb+srv://arihant:dYaCU49olltP8XLD@cluster0.6dbws.mongodb.net/second-brain-app",
    JWT_SECRET: process.env.JWT_SECRET || "arihant123",
};
