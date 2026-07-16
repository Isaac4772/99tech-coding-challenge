import express from "express";
import taskRoutes from "@/routes/task.routes";

const app = express();
const port = process.env.PORT || 8000;

export const startServer = async () => {
  app.use(express.json());

  app.use("/healthz", (_, res) => {
    res.send("OK");
  });

  app.use("/tasks", taskRoutes);

  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
};
