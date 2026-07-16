import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import type { Server } from "node:http";
import { app } from "@/server";
import { prisma } from "@/config/prisma";
import { TaskStatus, type Task } from "@/types/task";


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
  const task = (await res.json()) as Task;
  if (task?.id) createdIds.push(task.id);
  return { res, task };
}

describe("Task API (e2e)", () => {
  test("POST /tasks creates a task and returns 201", async () => {
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
    const tasks = (await res.json()) as Task[];
    expect(res.status).toBe(200);
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.some((t) => t.id === task.id)).toBe(true);
  });

  test("GET /tasks/:id returns the task when it exists", async () => {
    const { task } = await postTask({ title: "fetch by id" });
    const res = await fetch(`${baseUrl}/tasks/${task.id}`);
    const body = (await res.json()) as Task;
    expect(res.status).toBe(200);
    expect(body.id).toBe(task.id);
    expect(body.title).toBe("fetch by id");
  });

  test("GET /tasks/:id returns 404 when the task does not exist", async () => {
    const res = await fetch(`${baseUrl}/tasks/00000000-0000-0000-0000-000000000000`);
    expect(res.status).toBe(404);
    const body = (await res.json()) as { message: string };
    expect(body.message).toBe("Task not found");
  });

  test("PATCH /tasks/:id updates the status", async () => {
    const { task } = await postTask({ title: "patch me" });
    const res = await fetch(`${baseUrl}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: TaskStatus.completed }),
    });
    const body = (await res.json()) as Task;
    expect(res.status).toBe(200);
    expect(body.status).toBe(TaskStatus.completed);
    expect(body.title).toBe("patch me"); // untouched
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
});
