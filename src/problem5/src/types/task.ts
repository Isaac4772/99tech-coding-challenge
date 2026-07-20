import type { Task } from "@/generated/prisma/client";
import { TaskStatus } from "@/generated/prisma/client";

// The DB row shape and the status enum come from Prisma — the source of truth for
// the database.
export type { Task };
export { TaskStatus };

// The request input types come from the Zod request schemas — the source of truth for
// the API contract (validation + OpenAPI). See @/schemas/task.schema.
export type { TaskCreateInput, TaskUpdateInput } from "@/schemas/task.schema";
