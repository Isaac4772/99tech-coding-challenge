import { Router } from "express";
import {
  taskCreateController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "@/controllers/task.controller";
import { validate } from "@/middleware/validate";
import {
  createTaskBodySchema,
  updateTaskBodySchema,
  taskParamsSchema,
} from "@/schemas/task.schema";

const router = Router();

router.post("/", validate({ body: createTaskBodySchema }), taskCreateController);
router.get("/", getAllTasksController);
router.get("/:id", validate({ params: taskParamsSchema }), getTaskByIdController);
router.patch(
  "/:id",
  validate({ params: taskParamsSchema, body: updateTaskBodySchema }),
  updateTaskController
);
router.delete("/:id", validate({ params: taskParamsSchema }), deleteTaskController);

export default router;
