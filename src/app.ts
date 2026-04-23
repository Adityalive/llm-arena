import express from "express";
import graphAi from "./services/graph.ai";
import db from "./config/database";
import { createChat, getChatHistory, sendMessage } from "./controller/chat.controller";

const app = express();
app.use(express.json());
db();

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.post("/api/chats", createChat);
app.get("/api/chats/:chatId/messages", getChatHistory);
app.post("/api/chats/:chatId/messages", sendMessage);

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
