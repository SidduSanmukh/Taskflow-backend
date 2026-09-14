import express from "express";
import { handleHealthCheck } from "../controllers/app.controller";

const router = express.Router();

router.get("/health", handleHealthCheck);

export default router;
