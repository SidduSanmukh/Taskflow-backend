import express from "express";
import { healthMiddleware } from "./middlewares/app.middleware";
import cookieParser from "cookie-parser";
import router from "./routes/app.route";
const app = express();

app.use(express.json());
app.use("/api",healthMiddleware)
app.use(cookieParser());
app.use("/api", router);

export default app;
