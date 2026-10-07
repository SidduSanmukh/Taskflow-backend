import express from "express";
import { handleCookieSet, handleGetCookie, handleHealthCheck,handleCreateTasks,handleGetTasks,handleCookieDelete } from "../controllers/app.controller";

const router = express.Router();

router.get("/health", handleHealthCheck);
router.post("/cookie_set", handleCookieSet)
router.get("/cookie_get", handleGetCookie)
router.post("/cookie_delete", handleCookieDelete)
router.post("/tasks",handleCreateTasks)
router.get("/tasks", handleGetTasks)




export default router;
