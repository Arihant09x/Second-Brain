import dotenv from "dotenv";
dotenv.config();

interface Environment {
  BACKEND_URL: string;
}

export const env: Environment = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "",
};
