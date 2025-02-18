interface Environment {
  MONGO_URI: string;
  JWT_SECRET: string;
}

export const env: Environment = {
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://arihant:dYaCU49olltP8XLD@cluster0.6dbws.mongodb.net/second-brain-app",
  JWT_SECRET: process.env.JWT_SECRET || "arihant123",
};
