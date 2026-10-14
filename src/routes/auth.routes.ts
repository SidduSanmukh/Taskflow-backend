import { Router } from "express";
import { handleCreateUser, handleLogin } from "../controllers/auth.controller";

const router = Router();

router.post("/register", handleCreateUser);
router.post("/login", handleLogin);

export default router;
