/** Chat request schema, shared by the widget (client) and POST /api/chat (server). */
import { z } from "zod";

export const CHAT_LIMITS = {
  /** Characters per message. */
  messageChars: 600,
  /** Messages of history sent per request (older ones are dropped client-side). */
  history: 12,
} as const;

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(CHAT_LIMITS.messageChars * 4),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1)
    .max(CHAT_LIMITS.history)
    .refine((messages) => messages.at(-1)?.role === "user", "The last message must be from the user.")
    .refine(
      (messages) => messages.every((m) => m.role !== "user" || m.content.length <= CHAT_LIMITS.messageChars),
      `Keep each question under ${CHAT_LIMITS.messageChars} characters.`,
    ),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
