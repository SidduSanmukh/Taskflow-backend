import {Router} from "express"
import { loginService, registerService } from "../services/auth.service"
import { protect } from "../middlewares/auth.middleware"
import { handleCreateTasks, handleGetTask, handleGetTasks } from "../controllers/task.controller"

const router = Router()

router.use(protect)

router.post("/", handleCreateTasks)
router.get("/", handleGetTasks)
router.get("/:id", handleGetTask)
// router.patch("/:id", handleUpdateTask)
// router.delete("/:id", handleDeleteTask)

export default router