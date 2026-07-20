import { z } from "zod";
import { TaskStatus } from "@/generated/prisma/client";
import { successResponse } from "@/schemas/response.schema";

// Allowed status values are derived from the Prisma enum, so the DB stays the single source of truth
export const taskStatusSchema = z
  .enum(TaskStatus)
  .meta({ id: "TaskStatus", description: "Lifecycle status of a task" });

// ---- Request schemas (used for OpenAPI documentation) ----
export const createTaskBodySchema = z
  .object({
    title: z.string().min(1).meta({ example: "Write the README" }),
    description: z.string().optional().meta({ example: "Cover setup and usage" }),
  })
  .meta({ id: "CreateTaskInput" });

export const updateTaskBodyObject = z
  .object({
    title: z.string().min(1),
    description: z.string().nullable(),
    status: taskStatusSchema,
  })
  .partial()
  .meta({ id: "UpdateTaskInput" });

export const updateTaskBodySchema = updateTaskBodyObject.refine(
  (value) => Object.keys(value).length > 0,
  { message: "Provide at least one field to update" }
);

export const taskParamsSchema = z.object({
  id: z.uuid().meta({
    description: "Task id (UUID)",
    example: "018f6bc3-40cc-725b-9e79-f7b0f46c237b",
  }),
});

// ---- Response schemas (used for OpenAPI documentation) ----

export const taskSchema = z
  .object({
    id: z.uuid(),
    title: z.string(),
    description: z.string().nullable(),
    status: taskStatusSchema,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: "Task" });

export const taskResponseSchema = successResponse(taskSchema).meta({
  id: "TaskResponse",
});

export const taskListResponseSchema = successResponse(z.array(taskSchema)).meta({
  id: "TaskListResponse",
});

export type TaskCreateInput = z.infer<typeof createTaskBodySchema>;
export type TaskUpdateInput = z.infer<typeof updateTaskBodyObject>;
