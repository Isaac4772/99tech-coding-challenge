import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import type { Server } from "node:http";
import { app } from "@/server";
import { prisma } from "@/config/prisma";
import { TaskStatus, type Task } from "@/types/task";

// All endpoints return a consistent envelope:
//   success -> { success: true, data }
//   error   -> { success: false, error: { message, issues? } }
type SuccessBody<T> = { success: true; data: T };
type ErrorBody = {
  success: false;
  error: { message: string; issues?: { path: string; message: string }[] };
};

let server: Server;
let baseUrl: string;
const createdIds: string[] = [];

beforeAll(() => {
  server = app.listen(0);
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 0;
  baseUrl = `http://localhost:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  if (createdIds.length > 0) {
    await prisma.task.deleteMany({ where: { id: { in: createdIds } } });
  }
  await prisma.$disconnect();
});

async function postTask(body: object) {
  const res = await fetch(`${baseUrl}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as SuccessBody<Task>;
  if (json?.data?.id) createdIds.push(json.data.id);
  return { res, task: json.data };
}

describe("Task API (e2e)", () => {
  test("POST /tasks creates a task and returns 201 in a success envelope", async () => {
    const { res, task } = await postTask({ title: "e2e task", description: "via http" });
    expect(res.status).toBe(201);
    expect(typeof task.id).toBe("string");
    expect(task.title).toBe("e2e task");
    expect(task.description).toBe("via http");
    expect(task.status).toBe(TaskStatus.pending);
  });

  test("GET /tasks returns a list including the created task", async () => {
    const { task } = await postTask({ title: "listed task" });
    const res = await fetch(`${baseUrl}/tasks`);
    const body = (await res.json()) as SuccessBody<Task[]>;
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.some((t) => t.id === task.id)).toBe(true);
  });

  test("GET /tasks/:id returns the task when it exists", async () => {
    const { task } = await postTask({ title: "fetch by id" });
    const res = await fetch(`${baseUrl}/tasks/${task.id}`);
    const body = (await res.json()) as SuccessBody<Task>;
    expect(res.status).toBe(200);
    expect(body.data.id).toBe(task.id);
    expect(body.data.title).toBe("fetch by id");
  });

  test("GET /tasks/:id returns a 404 error envelope when the task does not exist", async () => {
    const res = await fetch(`${baseUrl}/tasks/00000000-0000-0000-0000-000000000000`);
    expect(res.status).toBe(404);
    const body = (await res.json()) as ErrorBody;
    expect(body.success).toBe(false);
    expect(body.error.message).toBe("Task not found");
  });

  test("PATCH /tasks/:id updates the status", async () => {
    const { task } = await postTask({ title: "patch me" });
    const res = await fetch(`${baseUrl}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: TaskStatus.completed }),
    });
    const body = (await res.json()) as SuccessBody<Task>;
    expect(res.status).toBe(200);
    expect(body.data.status).toBe(TaskStatus.completed);
    expect(body.data.title).toBe("patch me"); // untouched
  });

  test("DELETE /tasks/:id removes the task", async () => {
    const { task } = await postTask({ title: "delete me" });
    const del = await fetch(`${baseUrl}/tasks/${task.id}`, { method: "DELETE" });
    expect(del.status).toBe(200);

    const after = await fetch(`${baseUrl}/tasks/${task.id}`);
    expect(after.status).toBe(404);
  });

  test("GET /healthz returns OK", async () => {
    const res = await fetch(`${baseUrl}/healthz`);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");
  });

  describe("validation", () => {
    test("POST /tasks rejects an empty title with a 400 error envelope", async () => {
      const res = await fetch(`${baseUrl}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "" }),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as ErrorBody;
      expect(body.success).toBe(false);
      expect(body.error.message).toBe("Validation failed");
      expect(body.error.issues?.some((i) => i.path === "title")).toBe(true);
    });

    test("GET /tasks/:id rejects a non-UUID id with 400", async () => {
      const res = await fetch(`${baseUrl}/tasks/not-a-uuid`);
      expect(res.status).toBe(400);
    });

    test("PATCH /tasks/:id rejects an empty body with 400", async () => {
      const { task } = await postTask({ title: "patch validation" });
      const res = await fetch(`${baseUrl}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });

    test("PATCH /tasks/:id rejects an invalid status with 400", async () => {
      const { task } = await postTask({ title: "bad status" });
      const res = await fetch(`${baseUrl}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "banana" }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("misc", () => {
    test("unknown routes return a 404 error envelope", async () => {
      const res = await fetch(`${baseUrl}/nope`);
      expect(res.status).toBe(404);
      const body = (await res.json()) as ErrorBody;
      expect(body.success).toBe(false);
      expect(body.error.message).toBe("Route not found");
    });

    test("GET /openapi.json serves a 3.1.0 document describing /tasks", async () => {
      const res = await fetch(`${baseUrl}/openapi.json`);
      expect(res.status).toBe(200);
      const doc = (await res.json()) as { openapi: string; paths: Record<string, unknown> };
      expect(doc.openapi).toBe("3.1.0");
      expect(doc.paths["/tasks"]).toBeDefined();
      expect(doc.paths["/tasks/{id}"]).toBeDefined();
    });
  });
});
