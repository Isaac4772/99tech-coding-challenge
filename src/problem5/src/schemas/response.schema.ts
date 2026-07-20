import { z } from "zod";
import type { ZodType } from "zod";

// Zod mirrors of the response envelope (see @/utils/response) — used to document
// every response shape in OpenAPI.

// Wraps a data schema in the success envelope: { success: true, data }.
export const successResponse = <T extends ZodType>(data: T) =>
  z.object({ success: z.literal(true), data });

export const errorResponseSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      message: z.string(),
      issues: z
        .array(z.object({ path: z.string(), message: z.string() }))
        .optional(),
    }),
  })
  .meta({ id: "ErrorResponse" });
