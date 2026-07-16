import { prisma } from "@/config/prisma";
import type { Task, TaskCreateInput, TaskUpdateInput } from "@/types/task";

export async function createTaskRepository(task: TaskCreateInput): Promise<Task> {
    const { title, description } = task;
    const newTask = await prisma.task.create({
        data: {
            title,
            description,
        },
    });
    return newTask;
}

export async function getAllTasksRepository(): Promise<Task[]> {
    const tasks = await prisma.task.findMany();
    return tasks;
}

export async function getTaskByIdRepository(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
        where: { id },
    });
    return task;
}

export async function updateTaskRepository(id: string, task: TaskUpdateInput): Promise<Task> {
    const updatedTask = await prisma.task.update({
        where: { id },
        data: task,
    });
    return updatedTask;
}

export async function deleteTaskRepository(id: string): Promise<Task> {
    const deletedTask = await prisma.task.delete({
        where: { id },
    });
    return deletedTask;
}   
