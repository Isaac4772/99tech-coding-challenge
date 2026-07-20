import type { Response } from "express";

// Consistent response envelope used by every endpoint:
//   success -> { success: true, data }
//   error   -> { success: false, error: { message, issues? } }
export type ResponseIssue = { path: string; message: string };

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = {
  success: false;
  error: { message: string; issues?: ResponseIssue[] };
};
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function sendSuccess<T>(res: Response, status: number, data: T): void {
  const body: ApiSuccess<T> = { success: true, data };
  res.status(status).json(body);
}

export function sendError(
  res: Response,
  status: number,
  message: string,
  issues?: ResponseIssue[]
): void {
  const body: ApiError = {
    success: false,
    error: issues ? { message, issues } : { message },
  };
  res.status(status).json(body);
}
