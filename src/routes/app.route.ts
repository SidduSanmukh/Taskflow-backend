import express from "express";
import { handleCookieSet, handleGetCookie, handleHealthCheck,handleCreateTasks,handleGetTasks,AllTasks } from "../controllers/app.controller";

const router = express.Router();

router.get("/health", handleHealthCheck);
router.get("/cookie_set", handleCookieSet)
router.get("/cookie_get", handleGetCookie)
router.post("/tasks",handleCreateTasks)
router.get("/tasks",handleGetTasks)
router.post("/AllTasks",AllTasks)
router.get("/AllTasks",AllTasks)


export default router;
