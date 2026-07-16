import express from "express";

const app = express();
const port = process.env.PORT || 8000;

export const startServer = async () => {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
};
