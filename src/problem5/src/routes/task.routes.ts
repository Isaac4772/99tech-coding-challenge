import { Router } from "express";
import {
  taskCreateController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "@/controllers/task.controller";

const router = Router();

router.post("/", taskCreateController);
router.get("/", getAllTasksController);
router.get("/:id", getTaskByIdController);
router.patch("/:id", updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;
