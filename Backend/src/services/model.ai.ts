import { ChatCohere } from "@langchain/cohere";
import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";

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

const mistralModel = config.MISTRALAI_API_KEY
  ? new ChatMistralAI({
      apiKey: config.MISTRALAI_API_KEY,
      model: "mistral-small-latest",
    })
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
