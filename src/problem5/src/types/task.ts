import type { Prisma, Task } from "@/generated/prisma/client";

import { TaskStatus } from "@/generated/prisma/client";

export type { Task };

export { TaskStatus };

export type TaskCreateInput = Pick<Prisma.TaskCreateInput, "title" | "description">;

export type TaskUpdateInput = Pick<
  Prisma.TaskUpdateInput,
  "title" | "description" | "status"
>;
