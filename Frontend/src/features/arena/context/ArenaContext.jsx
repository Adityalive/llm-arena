import { useCallback, useMemo, useState } from "react";
import { evaluateProblem } from "../api/arenaApi";
import { formatHistoryTimestamp, toBulletPoints, truncateText } from "../../../shared/utils/formatters";
import { useChat } from "../../chat/hooks/useChat";

const INITIAL_HISTORY = [
  { id: "seed-1", title: "Problem: How to optimize API latency", timestamp: "Today" },
  { id: "seed-2", title: "Problem: Improve database throughput", timestamp: "Yesterday" },
  { id: "seed-3", title: "Problem: AI support response quality", timestamp: "2 days ago" },
];

import { ArenaContext } from "./ArenaContextValue";

function buildSolution(title, text, accent, score, isWinner) {
  return {
    id: `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
    title,
    body: text,
    score: typeof score === "number" ? score : null,
    bullets: toBulletPoints(text, 3),
    accent,
    winner: isWinner,
  };
}

function buildAssistantMessage(problem, response) {
  const judge = response?.judge ?? {};
  const winner = judge.winner ?? "tie";

  const solution1 = buildSolution(
    "Solution 1: Model Mistral",
    response?.solution_1 ?? "No output.",
    "green",
    judge.solution_1_score,
    winner === "solution_1"
  );

  const solution2 = buildSolution(
    "Solution 2: Model Cohere",
    response?.solution_2 ?? "No output.",
    "purple",
    judge.solution_2_score,
    winner === "solution_2"
  );

  return {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    createdAt: new Date().toISOString(),
    intro: `Here are two approaches for: "${truncateText(problem, 72)}"`,
    winner,
    reasoning: {
      solution1: judge.solution_1_reasoning || "No reasoning provided.",
      solution2: judge.solution_2_reasoning || "No reasoning provided.",
    },
    solutions: [solution1, solution2],
  };
}

export function ArenaProvider({ children }) {
  const { sendMessage, resetChat, setChatError } = useChat();

  const [messages, setMessages] = useState([]);
  const [historyItems, setHistoryItems] = useState(INITIAL_HISTORY);
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const submitProblem = useCallback(
    async (problem) => {
      const prompt = problem.trim();
      if (!prompt || isSubmitting) {
        return;
      }

      setError("");
      setIsSubmitting(true);

      const userMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: prompt,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setDraft("");

      const sendMessagePromise = sendMessage(prompt).catch((sendError) => {
        const message = sendError instanceof Error ? sendError.message : "Chat sync failed";
        setChatError(message);
      });

      try {
        const evaluation = await evaluateProblem(prompt);
        const assistantMessage = buildAssistantMessage(prompt, evaluation);

        setMessages((prev) => [...prev, assistantMessage]);
        setHistoryItems((prev) => [
          {
            id: `history-${Date.now()}`,
            title: `Problem: ${truncateText(prompt, 34)}`,
            timestamp: formatHistoryTimestamp(new Date().toISOString()),
          },
          ...prev,
        ]);
      } catch (submitError) {
        const message = submitError instanceof Error ? submitError.message : "Evaluation failed";
        setError(message);
      } finally {
        await sendMessagePromise;
        setIsSubmitting(false);
      }
    },
    [isSubmitting, sendMessage, setChatError]
  );

  const startNewProblem = useCallback(() => {
    resetChat();
    setMessages([]);
    setDraft("");
    setError("");
    setIsSidebarOpen(false);
  }, [resetChat]);

  const selectHistoryItem = useCallback((title) => {
    const prompt = title.replace(/^Problem:\s*/i, "");
    setDraft(prompt);
    setIsSidebarOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      messages,
      historyItems,
      draft,
      isSubmitting,
      error,
      isSidebarOpen,
      setDraft,
      setError,
      setIsSidebarOpen,
      submitProblem,
      startNewProblem,
      selectHistoryItem,
    }),
    [
      messages,
      historyItems,
      draft,
      isSubmitting,
      error,
      isSidebarOpen,
      submitProblem,
      startNewProblem,
      selectHistoryItem,
    ]
  );

  return <ArenaContext.Provider value={value}>{children}</ArenaContext.Provider>;
}
