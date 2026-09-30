"use client";

import { useCallback, useRef, useState } from "react";

import { isApiError, toErrorMessage } from "@/lib/api/http-error";
import type { ChatMessage } from "../schemas";
import { streamReply } from "../services/chat.service";

type Status = "idle" | "streaming" | "error";

/**
 * Conversation state for the chat widget. A streamed reply isn't cacheable
 * server state, so this is local state rather than a TanStack Query mutation.
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || status === "streaming") return;

      const history: ChatMessage[] = [...messages, { role: "user", content }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setStatus("streaming");
      setError(null);
      controller.current = new AbortController();

      try {
        for await (const chunk of streamReply(history, controller.current.signal)) {
          setMessages((current) => {
            const next = current.slice();
            const last = next.at(-1)!;
            next[next.length - 1] = { ...last, content: last.content + chunk };
            return next;
          });
        }
        setStatus("idle");
      } catch (cause) {
        // Drop the empty assistant bubble; keep the question so it can be retried.
        setMessages((current) => (current.at(-1)?.content ? current : current.slice(0, -1)));
        setError(
          isApiError(cause) && cause.isRateLimited
            ? "That's a lot of questions. Try again in a few minutes, or email me."
            : toErrorMessage(cause),
        );
        setStatus("error");
      }
    },
    [messages, status],
  );

  const stop = useCallback(() => {
    controller.current?.abort();
    setStatus("idle");
  }, []);

  const reset = useCallback(() => {
    controller.current?.abort();
    setMessages([]);
    setStatus("idle");
    setError(null);
  }, []);

  return { messages, status, error, send, stop, reset };
}
