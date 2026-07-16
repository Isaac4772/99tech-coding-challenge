import * as taskRepository from "@/repositories/task.repository";
import type { Task, TaskCreateInput, TaskUpdateInput } from "@/types/task";

export async function createTaskService(task: TaskCreateInput): Promise<Task> {
    return await taskRepository.createTaskRepository(task);
}

export async function getAllTasksService(): Promise<Task[]> {
    return await taskRepository.getAllTasksRepository();
}

export async function getTaskByIdService(id: string): Promise<Task | null> {
    return await taskRepository.getTaskByIdRepository(id);
}

export async function updateTaskService(id: string, task: TaskUpdateInput): Promise<Task> {
    return await taskRepository.updateTaskRepository(id, task);
}

export async function deleteTaskService(id: string): Promise<Task> {
    return await taskRepository.deleteTaskRepository(id);
}