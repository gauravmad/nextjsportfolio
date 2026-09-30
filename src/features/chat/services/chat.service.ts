/** Chat API calls. Plain async functions: no React. */
import { api } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { CHAT_LIMITS, type ChatMessage } from "../schemas";

/** Streams the assistant's reply to a conversation, chunk by chunk. */
export function streamReply(messages: ChatMessage[], signal?: AbortSignal) {
  return api.stream(ENDPOINTS.chat, { messages: messages.slice(-CHAT_LIMITS.history) }, { signal });
}
