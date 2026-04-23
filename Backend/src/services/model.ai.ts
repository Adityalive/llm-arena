import { ChatCohere } from "@langchain/cohere";
import { ChatGoogle } from "@langchain/google";
import MistralClient from "@mistralai/mistralai";

import config from "../config/config";

export type ModelProvider = "google" | "mistral" | "cohere";
export type AppModel = {
  invoke: (input: unknown) => Promise<unknown>;
  stream?: (input: unknown) => AsyncIterable<unknown> | Promise<AsyncIterable<unknown>>;
};

const googleModel = config.GOOGLE_API_KEY
  ? new ChatGoogle({
      apiKey: config.GOOGLE_API_KEY,
      model: "gemini-2.5-flash",
    })
  : null;

type MistralChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function getMessageRole(message: unknown): MistralChatMessage["role"] {
  if (message && typeof message === "object") {
    const maybeMessage = message as {
      role?: unknown;
      _getType?: () => string;
    };

    if (maybeMessage.role === "assistant" || maybeMessage.role === "system") {
      return maybeMessage.role;
    }

    const type = maybeMessage._getType?.();
    if (type === "ai") {
      return "assistant";
    }
    if (type === "system") {
      return "system";
    }
  }

  return "user";
}

function getMessageContent(message: unknown): string {
  if (typeof message === "string") {
    return message;
  }

  if (message && typeof message === "object") {
    const content = (message as { content?: unknown }).content;

    if (typeof content === "string") {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .map((part) => {
          if (typeof part === "string") {
            return part;
          }

          if (part && typeof part === "object") {
            const text = (part as { text?: unknown }).text;
            return typeof text === "string" ? text : "";
          }

          return "";
        })
        .join("");
    }
  }

  return "";
}

function toMistralMessages(input: unknown): MistralChatMessage[] {
  const inputMessages = Array.isArray(input) ? input : [input];
  const messages = inputMessages
    .map((message) => ({
      role: getMessageRole(message),
      content: getMessageContent(message),
    }))
    .filter((message) => message.content.trim());

  return messages.length ? messages : [{ role: "user", content: "" }];
}

function createMistralModel(apiKey: string): AppModel {
  const client = new MistralClient(apiKey);
  const model = "mistral-small-latest";

  return {
    async invoke(input: unknown) {
      const response = await client.chat({
        model,
        messages: toMistralMessages(input),
      });

      return response.choices[0]?.message.content ?? "";
    },

    async *stream(input: unknown) {
      const stream = await client.chatStream({
        model,
        messages: toMistralMessages(input),
      });

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta.content;
        if (token) {
          yield token;
        }
      }
    },
  };
}

const mistralModel = config.MISTRALAI_API_KEY
  ? createMistralModel(config.MISTRALAI_API_KEY)
  : null;

const cohereModel = config.COHERE_API_KEY
  ? new ChatCohere({
      apiKey: config.COHERE_API_KEY,
      model: "command-a-03-2025",
    })
  : null;

const modelRegistry = {
  google: googleModel,
  mistral: mistralModel,
  cohere: cohereModel,
} as const;

export function getConfiguredModel(provider: ModelProvider): AppModel | null {
  return modelRegistry[provider] as AppModel | null;
}

export function getModel(provider: ModelProvider = "google"): AppModel {
  const model = getConfiguredModel(provider);

  if (model) {
    return model;
  }

  const fallback = (googleModel ?? mistralModel ?? cohereModel) as AppModel | null;

  if (fallback) {
    return fallback;
  }

  throw new Error(
    "No model API key configured. Add GOOGLE_API_KEY, MISTRALAI_API_KEY, or COHERE_API_KEY to your environment."
  );
}

const defaultModel = getModel();

export default defaultModel;
