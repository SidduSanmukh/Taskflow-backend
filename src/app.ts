import express from "express";
// import { healthMiddleware } from "./middlewares/app.middleware";
import cookieParser from "cookie-parser";
import taskRouter from "./routes/task.roures";
import authRouter from "./routes/auth.routes";
const app = express();

app.use(express.json());
// app.use("/api", healthMiddleware);
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

export default app;
