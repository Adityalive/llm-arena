import { useCallback, useEffect, useMemo, useState } from "react";
import { evaluateProblem } from "../api/arenaApi";
import { formatHistoryTimestamp, toBulletPoints, truncateText } from "../../../shared/utils/formatters";
import { getChats } from "../../chat/api/chatApi";
import { useChat } from "../../chat/hooks/useChat";

import { ArenaContext } from "./ArenaContextValue";

function mapStoredMessage(message) {
  return {
    id: message._id ?? `${message.role}-${message.createdAt ?? Date.now()}`,
    role: message.role,
    content: message.content ?? "",
    createdAt: message.createdAt,
  };
}

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
  const { sendMessage, openChat, resetChat, setChatError } = useChat();

  const [messages, setMessages] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadChatHistory() {
      try {
        const response = await getChats();
        const chats = Array.isArray(response?.data) ? response.data : [];

        if (!isActive) {
          return;
        }

        setHistoryItems(
          chats
            .map((chat) => {
              const prompt = typeof chat.title === "string" ? chat.title.trim() : "";

              if (!prompt) {
                return null;
              }

              return {
                id: chat.chatId,
                title: `Problem: ${truncateText(prompt, 34)}`,
                timestamp: formatHistoryTimestamp(chat.updatedAt ?? chat.createdAt),
              };
            })
            .filter(Boolean)
        );
      } catch (historyError) {
        if (!isActive) {
          return;
        }

        const message = historyError instanceof Error ? historyError.message : "Unable to load chat history";
        setChatError(message);
      }
    }

    loadChatHistory();

    return () => {
      isActive = false;
    };
  }, [setChatError]);

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

      const sendMessagePromise = sendMessage(prompt)
        .then((response) => response?.data?.chatId ?? null)
        .catch((sendError) => {
          const message = sendError instanceof Error ? sendError.message : "Chat sync failed";
          setChatError(message);
          return null;
        });

      try {
        const evaluation = await evaluateProblem(prompt);
        const assistantMessage = buildAssistantMessage(prompt, evaluation);
        const savedChatId = await sendMessagePromise;

        setMessages((prev) => [...prev, assistantMessage]);
        setHistoryItems((prev) => [
          {
            id: savedChatId ?? `history-${Date.now()}`,
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

  const selectHistoryItem = useCallback(
    async (item) => {
      if (!item?.id) {
        return;
      }

      setError("");
      setDraft("");
      setIsSidebarOpen(false);

      try {
        const storedMessages = await openChat(item.id);
        setMessages(storedMessages.map(mapStoredMessage));
      } catch (historyError) {
        const message = historyError instanceof Error ? historyError.message : "Unable to load chat messages";
        setError(message);
      }
    },
    [openChat]
  );

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
