import express from "express";
import swaggerUi from "swagger-ui-express";
import taskRoutes from "@/routes/task.routes";
import { openApiDocument } from "@/docs/openapi";
import { notFoundHandler, errorHandler } from "@/middleware/error";

export const app = express();

app.use(express.json());

app.use("/healthz", (_, res) => {
  res.send("OK");
});

app.get("/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/tasks", taskRoutes);

// Unmatched routes + centralised error envelope (must be registered last).
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 8000;

export const startServer = async () => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
};
