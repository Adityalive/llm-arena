import { useCallback, useMemo, useState } from "react";
import { createChat, getChatHistory, sendChatMessage } from "../api/chatApi";

import { ChatContext } from "./ChatContextValue";

export function ChatProvider({ children }) {
  const [chatId, setChatId] = useState(null);
  const [chatError, setChatError] = useState("");

  const ensureChat = useCallback(async () => {
    if (chatId) {
      return chatId;
    }

    const response = await createChat({});
    const nextChatId = response?.data?.chatId;

    if (!nextChatId) {
      throw new Error("Unable to create chat session.");
    }

    setChatId(nextChatId);
    return nextChatId;
  }, [chatId]);

  const sendMessage = useCallback(
    async (content) => {
      const resolvedChatId = await ensureChat();
      return sendChatMessage(resolvedChatId, { content });
    },
    [ensureChat]
  );

  const fetchHistory = useCallback(async () => {
    if (!chatId) {
      return [];
    }

    const response = await getChatHistory(chatId);
    return response?.data?.messages ?? [];
  }, [chatId]);

  const openChat = useCallback(async (nextChatId) => {
    const response = await getChatHistory(nextChatId);
    setChatId(nextChatId);
    setChatError("");
    return response?.data?.messages ?? [];
  }, []);

  const resetChat = useCallback(() => {
    setChatId(null);
    setChatError("");
  }, []);

  const value = useMemo(
    () => ({
      chatId,
      chatError,
      setChatError,
      ensureChat,
      sendMessage,
      fetchHistory,
      openChat,
      resetChat,
    }),
    [chatId, chatError, ensureChat, sendMessage, fetchHistory, openChat, resetChat]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
