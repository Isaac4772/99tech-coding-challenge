import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@/generated/prisma/client";
import { sendError } from "@/utils/response";

// Catch-all for requests that matched no route.
export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, 404, "Route not found");
}

// Centralised error handler so every thrown/forwarded error becomes a consistent
// error envelope instead of Express's default HTML response.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express needs the 4-arg signature to treat this as an error handler
  _next: NextFunction
): void {
  // Prisma "record not found" (e.g. update/delete on a missing id) -> 404.
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    sendError(res, 404, "Task not found");
    return;
  }

  console.error(err);
  sendError(res, 500, "Internal server error");
}
