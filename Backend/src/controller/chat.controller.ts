import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { HumanMessage } from "@langchain/core/messages";
import Chat from "../models/chat.model";
import Message from "../models/Message.model";
import { getModel, type ModelProvider } from "../services/model.ai";

type AppIo = {
  to: (room: string) => {
    emit: (event: string, payload: unknown) => void;
  };
};

const ALLOWED_MODEL_PROVIDERS: ModelProvider[] = ["google", "mistral", "cohere"];

function isObjectId(value: string) {
  return mongoose.Types.ObjectId.isValid(value);
}

function getStringParam(value: string | string[] | undefined): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }

  return null;
}

function parseProvider(value: unknown): ModelProvider | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  return ALLOWED_MODEL_PROVIDERS.includes(value as ModelProvider)
    ? (value as ModelProvider)
    : undefined;
}

function extractText(chunk: unknown): string {
  if (!chunk) {
    return "";
  }

  if (typeof chunk === "string") {
    return chunk;
  }

  if (typeof chunk === "object") {
    const maybeChunk = chunk as {
      text?: unknown;
      content?: unknown;
    };

    if (typeof maybeChunk.text === "string") {
      return maybeChunk.text;
    }

    if (typeof maybeChunk.content === "string") {
      return maybeChunk.content;
    }

    if (Array.isArray(maybeChunk.content)) {
      return maybeChunk.content
        .map((part) => {
          if (typeof part === "string") {
            return part;
          }

          if (part && typeof part === "object" && "text" in part) {
            const partText = (part as { text?: unknown }).text;
            return typeof partText === "string" ? partText : "";
          }

          return "";
        })
        .join("");
    }
  }

  return "";
}

function emitToChat(io: AppIo | undefined, chatId: string, event: string, payload: unknown) {
  if (!io) {
    return;
  }

  io.to(`chat:${chatId}`).emit(event, payload);
}

export async function getChats(_req: Request, res: Response) {
  try {
    const chats = await Message.aggregate([
      {
        $match: {
          role: "user",
          content: { $type: "string", $ne: "" },
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$chatId",
          title: { $first: "$content" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $last: "$updatedAt" },
        },
      },
      { $sort: { updatedAt: -1 } },
      { $limit: 50 },
    ]);

    res.status(200).json({
      message: "Chats fetched successfully",
      data: chats.map((chat) => ({
        chatId: chat._id,
        title: chat.title,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error fetching chats", error: message });
  }
}

export async function createChat(req: Request, res: Response) {
  const { userId, sessionId } = req.body ?? {};

  try {
    const resolvedUserId = typeof userId === "string" && userId.trim() ? userId.trim() : null;
    const resolvedSessionId =
      typeof sessionId === "string" && sessionId.trim() ? sessionId.trim() : randomUUID();

    const chat = await Chat.create({
      userId: resolvedUserId,
      sessionId: resolvedSessionId,
      messages: [],
    });

    res.status(201).json({
      message: "Chat created successfully",
      data: {
        chatId: chat._id,
        userId: chat.userId,
        sessionId: chat.sessionId,
        createdAt: chat.createdAt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error creating chat", error: message });
  }
}

export async function getChatHistory(req: Request, res: Response) {
  const chatId = getStringParam(req.params.chatId);

  if (!chatId || !isObjectId(chatId)) {
    res.status(400).json({ message: "Invalid chatId" });
    return;
  }

  try {
    const chat = await Chat.findById(chatId).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } },
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    res.status(200).json({
      message: "Chat history fetched successfully",
      data: {
        chatId: chat._id,
        messages: chat.messages,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error fetching chat history", error: message });
  }
}

export async function sendMessage(req: Request, res: Response) {
  const chatId = getStringParam(req.params.chatId);
  const { content, problem, provider } = req.body ?? {};

  if (!chatId || !isObjectId(chatId)) {
    res.status(400).json({ message: "Invalid chatId" });
    return;
  }

  const prompt = typeof content === "string" ? content : typeof problem === "string" ? problem : "";
  if (!prompt.trim()) {
    res.status(400).json({ message: "content is required and must be a non-empty string" });
    return;
  }

  const selectedProvider = parseProvider(provider);

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const runId = randomUUID();
    const modelLabel = selectedProvider ?? "auto";

    const userMessage = (await Message.create({
      content: prompt,
      role: "user",
      chatId,
      status: "complete",
      runId,
      model: null,
    })) as any;

    const assistantMessage = (await Message.create({
      content: "",
      role: "assistant",
      chatId,
      status: "streaming",
      runId,
      model: modelLabel,
    })) as any;

    await Chat.findByIdAndUpdate(chatId, {
      $push: {
        messages: {
          $each: [userMessage._id, assistantMessage._id],
        },
      },
    });

    res.status(202).json({
      message: "Message accepted",
      data: {
        chatId,
        userMessageId: userMessage._id,
        assistantMessageId: assistantMessage._id,
        runId,
        status: "streaming",
      },
    });

    const io = req.app.get("io") as AppIo | undefined;

    void (async () => {
      try {
        emitToChat(io, chatId, "chat:assistant_started", {
          chatId,
          runId,
          userMessageId: userMessage._id,
          assistantMessageId: assistantMessage._id,
          model: modelLabel,
          status: "streaming",
        });

        const model = getModel(selectedProvider);
        let finalContent = "";

        const messages = [new HumanMessage(prompt)];

        const maybeStreamModel = model as unknown as {
          stream?: (input: HumanMessage[]) => AsyncIterable<unknown> | Promise<AsyncIterable<unknown>>;
          invoke: (input: HumanMessage[]) => Promise<unknown>;
        };

        if (typeof maybeStreamModel.stream === "function") {
          const stream = await maybeStreamModel.stream(messages);
          for await (const chunk of stream) {
            const token = extractText(chunk);
            if (!token) {
              continue;
            }

            finalContent += token;
            emitToChat(io, chatId, "chat:token", {
              chatId,
              runId,
              assistantMessageId: assistantMessage._id,
              token,
            });
          }
        } else {
          const response = await maybeStreamModel.invoke(messages);
          finalContent = extractText(response);

          if (finalContent) {
            emitToChat(io, chatId, "chat:token", {
              chatId,
              runId,
              assistantMessageId: assistantMessage._id,
              token: finalContent,
            });
          }
        }

        await Message.findByIdAndUpdate(assistantMessage._id, {
          content: finalContent,
          status: "complete",
        });

        emitToChat(io, chatId, "chat:assistant_completed", {
          chatId,
          runId,
          assistantMessageId: assistantMessage._id,
          content: finalContent,
          status: "complete",
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        await Message.findByIdAndUpdate(assistantMessage._id, {
          status: "error",
        });

        emitToChat(io, chatId, "chat:error", {
          chatId,
          runId,
          assistantMessageId: assistantMessage._id,
          status: "error",
          error: errorMessage,
        });
      }
    })();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error sending message", error: message });
  }
}
