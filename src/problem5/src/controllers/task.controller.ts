import * as taskService from "@/services/task.service";
import type { TaskCreateInput, TaskUpdateInput } from "@/types/task";
import { sendSuccess, sendError } from "@/utils/response";
import type { Request, Response, NextFunction } from "express";

export const taskCreateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskData: TaskCreateInput = req.body;
    const newTask = await taskService.createTaskService(taskData);
    sendSuccess(res, 201, newTask);
  } catch (error) {
    next(error);
  }
};

export const getAllTasksController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await taskService.getAllTasksService();
    sendSuccess(res, 200, tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      sendError(res, 400, "Invalid task id");
      return;
    }
    const task = await taskService.getTaskByIdService(id);
    if (task) {
      sendSuccess(res, 200, task);
    } else {
      sendError(res, 404, "Task not found");
    }
  } catch (error) {
    next(error);
  }
};

export const updateTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      sendError(res, 400, "Invalid task id");
      return;
    }
    const taskData: TaskUpdateInput = req.body;
    const updatedTask = await taskService.updateTaskService(id, taskData);
    sendSuccess(res, 200, updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      sendError(res, 400, "Invalid task id");
      return;
    }
    const deletedTask = await taskService.deleteTaskService(id);
    sendSuccess(res, 200, deletedTask);
  } catch (error) {
    next(error);
  }
};
