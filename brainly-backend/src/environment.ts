import dotenv from "dotenv";

dotenv.config();

interface Environment {
  MONGO_URI: string;
  JWT_SECRET: string;
}

export const env: Environment = {
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
};
