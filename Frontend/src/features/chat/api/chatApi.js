import { get, post } from "../../../shared/api/httpClient";

export async function createChat(payload = {}) {
  return post("/api/chats", payload);
}

export async function sendChatMessage(chatId, payload) {
  return post(`/api/chats/${chatId}/messages`, payload);
}

export async function getChatHistory(chatId) {
  return get(`/api/chats/${chatId}/messages`);
}
