import express from "express";
import taskRoutes from "@/routes/task.routes";

// The configured Express app, built at module load so tests can import it and
// listen on an ephemeral port without going through startServer().
export const app = express();

app.use(express.json());

app.use("/healthz", (_, res) => {
  res.send("OK");
});

app.use("/tasks", taskRoutes);

const port = process.env.PORT || 8000;

export const startServer = async () => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
};
