import type { Request, Response, NextFunction } from "express";
import type { ZodError, ZodType } from "zod";
import { sendError } from "@/utils/response";

// A request-validation middleware factory. Pass any of body/params/query schemas;
// each provided part is parsed and, on failure, the request is rejected with a 400
// and a flat list of issues. A validated body is written back (parsed + stripped of
// unknown keys) so controllers receive clean data.
type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

function formatIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export function validate(schemas: RequestSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const fail = (error: ZodError) => {
      sendError(res, 400, "Validation failed", formatIssues(error));
    };

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) return fail(result.error);
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) return fail(result.error);
    }

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) return fail(result.error);
      req.body = result.data;
    }

    next();
  };
}
