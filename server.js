import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import apiRouter from "./api/router.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const initializeExpressServer = async () => {
    dotenv.config();
    const port = process.env.PORT;

    const app = express();
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: false, limit: "50mb" }));

    app.use("/api/v1/ai-conversation", apiRouter);

    if (process.env.NODE_ENV === "production") {
        console.log("up here prod");
        app.use(express.static(path.join(__dirname, "frontend/dist")));

        app.get("*", (req, res) =>
            res.sendFile(
                path.resolve(__dirname, "frontend", "dist", "index.html")
            )
        );
    } else {
        console.log("down here dev");
        app.get("/", (req, res) => res.send("Please set to production"));
    }

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    return app;
};

const expressApp = initializeExpressServer();
export default expressApp;
