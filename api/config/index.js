import dotenv from "dotenv";

dotenv.config();

const AppConfig = {
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 3000,
};

export { AppConfig };
