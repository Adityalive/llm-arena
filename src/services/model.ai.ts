import { ChatCohere } from "@langchain/cohere";
import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";

import config from "../config/config";

export type ModelProvider = "google" | "mistral" | "cohere";

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

export const models = {
  google: googleModel,
  mistral: mistralModel,
  cohere: cohereModel,
} as const;

export function getModel(provider: ModelProvider = "google") {
  const model = models[provider];

  if (model) {
    return model;
  }

  const fallback = googleModel ?? mistralModel ?? cohereModel;

  if (fallback) {
    return fallback;
  }

  throw new Error(
    "No model API key configured. Add GOOGLE_API_KEY, MISTRAL_API_KEY, or COHERE_API_KEY to your environment."
  );
}

const taskModel = getModel();

export default taskModel;
