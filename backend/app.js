import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connectDB } from "./database/Connection.js";
import messageRouter from "./routes/message.route.js"
import userRouter from "./routes/user.route.js";
import timelineRouter from "./routes/timeline.route.js";
import applicationRouter from "./routes/softwareApplication.route.js";
import skillsRouter from "./routes/skill.route.js";
import ProjectRouter from "./routes/project.route.js";

//setup secure variable environment
const app = express();
dotenv.config({
    path: "./config/.env"
})

//Connect backend and frontend
app.use(
    cors({
        origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
        methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
        credentials: true
    })
);

//Use mandatory middleware for our project
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/"
}))
//connect to database
connectDB();

//routes--
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/softwareApplication", applicationRouter);
app.use("/api/v1/skills", skillsRouter);
app.use("/api/v1/project", ProjectRouter);

export { app };