import { createDocument } from "zod-openapi";
import type { ZodType } from "zod";
import {
  createTaskBodySchema,
  updateTaskBodyObject,
  taskParamsSchema,
  taskResponseSchema,
  taskListResponseSchema,
} from "@/schemas/task.schema";
import { errorResponseSchema } from "@/schemas/response.schema";

const json = (schema: ZodType) => ({ "application/json": { schema } });

// OpenAPI 3.1 document generated from the Zod schemas, so the docs never drift from the code.
export const openApiDocument = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Task API",
    version: "1.0.0",
    description: "A simple task CRUD API (problem 5).",
  },
  tags: [{ name: "Tasks", description: "Task resource operations" }],
  paths: {
    "/tasks": {
      post: {
        summary: "Create a task",
        tags: ["Tasks"],
        requestBody: { content: json(createTaskBodySchema) },
        responses: {
          "201": { description: "Task created", content: json(taskResponseSchema) },
          "400": { description: "Validation failed", content: json(errorResponseSchema) },
        },
      },
      get: {
        summary: "List all tasks",
        tags: ["Tasks"],
        responses: {
          "200": { description: "Array of tasks", content: json(taskListResponseSchema) },
        },
      },
    },
    "/tasks/{id}": {
      get: {
        summary: "Get a task by id",
        tags: ["Tasks"],
        requestParams: { path: taskParamsSchema },
        responses: {
          "200": { description: "The task", content: json(taskResponseSchema) },
          "400": { description: "Invalid id", content: json(errorResponseSchema) },
          "404": { description: "Task not found", content: json(errorResponseSchema) },
        },
      },
      patch: {
        summary: "Update a task",
        tags: ["Tasks"],
        requestParams: { path: taskParamsSchema },
        requestBody: { content: json(updateTaskBodyObject) },
        responses: {
          "200": { description: "The updated task", content: json(taskResponseSchema) },
          "400": { description: "Validation failed", content: json(errorResponseSchema) },
          "404": { description: "Task not found", content: json(errorResponseSchema) },
        },
      },
      delete: {
        summary: "Delete a task",
        tags: ["Tasks"],
        requestParams: { path: taskParamsSchema },
        responses: {
          "200": { description: "The deleted task", content: json(taskResponseSchema) },
          "400": { description: "Invalid id", content: json(errorResponseSchema) },
          "404": { description: "Task not found", content: json(errorResponseSchema) },
        },
      },
    },
  },
});
