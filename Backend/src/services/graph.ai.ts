import { END, StateGraph } from "@langchain/langgraph";
import z from "zod";
import { getConfiguredModel, getModel } from "./model.ai";

type JudgeResult = {
  solution_1_score: number;
  solution_2_score: number;
  winner: "solution_1" | "solution_2" | "tie";
  solution_1_reasoning: string;
  solution_2_reasoning: string;
};

type GraphState = {
  problem: string;
  solution_1: string;
  solution_2: string;
  judge: JudgeResult;
};

const judgeResultSchema = z.object({
  solution_1_score: z.number().min(0).max(10),
  solution_2_score: z.number().min(0).max(10),
  winner: z.enum(["solution_1", "solution_2", "tie"]),
  solution_1_reasoning: z.string(),
  solution_2_reasoning: z.string(),
});

const defaultJudgeResult: JudgeResult = {
  solution_1_score: 0,
  solution_2_score: 0,
  winner: "tie",
  solution_1_reasoning: "",
  solution_2_reasoning: "",
};

function extractText(output: unknown): string {
  if (!output) {
    return "";
  }

  if (typeof output === "string") {
    return output;
  }

  if (typeof output === "object") {
    const maybeOutput = output as {
      text?: unknown;
      content?: unknown;
    };

    if (typeof maybeOutput.text === "string") {
      return maybeOutput.text;
    }

    if (typeof maybeOutput.content === "string") {
      return maybeOutput.content;
    }

    if (Array.isArray(maybeOutput.content)) {
      return maybeOutput.content
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

function tryParseJudgeResult(rawText: string): JudgeResult {
  const trimmed = rawText.trim();
  const withoutFence = trimmed.replace(/^```(?:json)?\s*|\s*```$/g, "");
  const parsed = JSON.parse(withoutFence);
  return judgeResultSchema.parse(parsed);
}

const solutionNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  const mistralModel = getConfiguredModel("mistral");
  const cohereModel = getConfiguredModel("cohere");

  if (!mistralModel || !cohereModel) {
    throw new Error("Mistral and Cohere models must be configured to run solutionNode.");
  }

  const [mistralResponse, cohereResponse] = await Promise.all([
    mistralModel.invoke(state.problem),
    cohereModel.invoke(state.problem),
  ]);

  return {
    solution_1: extractText(mistralResponse),
    solution_2: extractText(cohereResponse),
  };
};

const judgeNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  const prompt = [
    "You are evaluating two AI solutions.",
    "Return strict JSON only with this exact schema:",
    '{ "solution_1_score": number 0-10, "solution_2_score": number 0-10, "winner": "solution_1" | "solution_2" | "tie", "solution_1_reasoning": string, "solution_2_reasoning": string }',
    `Problem: ${state.problem}`,
    `Solution_1: ${state.solution_1}`,
    `Solution_2: ${state.solution_2}`,
  ].join("\n");

  const judgeModel = getModel("mistral");
  const judgeResponse = await judgeModel.invoke(prompt);
  const rawText = extractText(judgeResponse);

  let parsed = defaultJudgeResult;
  try {
    parsed = tryParseJudgeResult(rawText);
  } catch {
    parsed = {
      ...defaultJudgeResult,
      solution_1_reasoning: rawText || "Could not parse structured judge response.",
      solution_2_reasoning: rawText || "Could not parse structured judge response.",
    };
  }

  return { judge: parsed };
};

const workflow = new StateGraph<GraphState>({
  channels: {
    problem: "string",
    solution_1: "string",
    solution_2: "string",
    judge: "object",
  },
});

workflow.addNode("solution", solutionNode);
workflow.addNode("judge", judgeNode);
workflow.setEntryPoint("solution");
workflow.addEdge("solution", "judge");
workflow.addEdge("judge", END);

const graph = workflow.compile();

export default async function graphAi(problem: string) {
  if (!problem?.trim()) {
    throw new Error("problem is required and must be a non-empty string");
  }

  const result = await graph.invoke({
    problem: problem.trim(),
    solution_1: "",
    solution_2: "",
    judge: defaultJudgeResult,
  });

  return result as GraphState;
}
