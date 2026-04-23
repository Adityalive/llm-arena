import express from "express";
import graphAi from "./services/graph.ai";
import db from "./config/database";
import morgan from "morgan";
import { createChat, getChatHistory, sendMessage } from "./controller/chat.controller";
import router from "./router/chat.router";
const app = express();
app.use(express.json());
db();
app.use(morgan("dev"));
app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.use("/api", router);

app.post("/evaluate", async (req, res) => {
  const { problem } = req.body;
  if (typeof problem !== "string" || !problem.trim()) {
    res.status(400).json({ error: "problem is required and must be a non-empty string" });
    return;
  }

  const result = await graphAi(problem);
  res.json(result);
});

export default app;
