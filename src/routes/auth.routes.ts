import { Router } from "express";
import { getMe, handleCreateUser, handleLogin } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", handleCreateUser);
router.post("/login", handleLogin);
router.get("/me", protect, getMe)

export default router;
