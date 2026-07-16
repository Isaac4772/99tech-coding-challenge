import * as taskService from "@/services/task.service";
import type { TaskCreateInput, TaskUpdateInput } from "@/types/task";
import type { Request, Response, NextFunction } from "express";

export const taskCreateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskData: TaskCreateInput = req.body;
    const newTask = await taskService.createTaskService(taskData);
    res.status(201).json(newTask);
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
    res.status(200).json(tasks);
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
      res.status(400).json({ message: "Invalid task id" });
      return;
    }
    const task = await taskService.getTaskByIdService(id);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
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
      res.status(400).json({ message: "Invalid task id" });
      return;
    }
    const taskData: TaskUpdateInput = req.body;
    const updatedTask = await taskService.updateTaskService(id, taskData);
    res.status(200).json(updatedTask);
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
      res.status(400).json({ message: "Invalid task id" });
      return;
    }
    const deletedTask = await taskService.deleteTaskService(id);
    res.status(200).json(deletedTask);
  } catch (error) {
    next(error);
  }
}; 
