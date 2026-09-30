/**
 * POST /api/chat
 *
 * The "Ask me anything" assistant. Validates the conversation, then streams
 * the model's reply from OpenRouter back as plain text.
 *
 * Responses:
 *   200 text/plain stream of the reply
 *   400 BAD_REQUEST · 413 PAYLOAD_TOO_LARGE · 422 VALIDATION_ERROR
 *   429 RATE_LIMITED (+ Retry-After) · 503 SERVICE_UNAVAILABLE · 502 upstream failure
 *
 * Errors before the stream starts use the normal `{ error }` envelope, so
 * `api.stream()` turns them into an `ApiError` like any other call.
 */
import type { NextRequest } from "next/server";

import { chatRequestSchema } from "@/features/chat/schemas";
import { getServerEnv } from "@/lib/config/env";
import { API_ERROR_CODES } from "@/types/api";
import {
  badRequest,
  fail,
  payloadTooLarge,
  serviceUnavailable,
  tooManyRequests,
  validationError,
} from "@/app/api/_lib/api-response";
import { ASSISTANT_PROMPT } from "@/app/api/_lib/assistant-prompt";
import { rateLimit } from "@/app/api/_lib/rate-limit";
import { clientIp, parseJsonBody } from "@/app/api/_lib/request";

const RATE_LIMIT = { limit: 20, windowMs: 10 * 60_000 };

export async function POST(request: NextRequest) {
  const { OPENROUTER_API_KEY, OPENROUTER_BASE_URL, OPENROUTER_MODEL } = getServerEnv();
  if (!OPENROUTER_API_KEY) return serviceUnavailable("The assistant is offline right now.");

  const limit = rateLimit(`chat:${clientIp(request)}`, RATE_LIMIT);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

  const body = await parseJsonBody(request, chatRequestSchema, { maxBytes: 32 * 1024 });
  if (!body.ok) {
    if (body.reason === "too_large") return payloadTooLarge();
    if (body.reason === "malformed") return badRequest("Request body must be valid JSON.");
    return validationError(body.details, "That message couldn't be sent.");
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      // Stop paying for tokens if the visitor closes the chat mid-answer.
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(45_000)]),
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": request.nextUrl.origin,
        "X-Title": "Gaurav Madan portfolio",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        stream: true,
        temperature: 0.3,
        max_tokens: 800,
        messages: [{ role: "system", content: ASSISTANT_PROMPT }, ...body.data.messages],
      }),
    });
  } catch (error) {
    console.error("[chat] upstream request failed:", error);
    return fail(502, API_ERROR_CODES.unavailable, "The assistant didn't respond. Please try again.");
  }

  if (!upstream.ok || !upstream.body) {
    console.error("[chat] upstream error:", upstream.status, await upstream.text().catch(() => ""));
    return fail(502, API_ERROR_CODES.unavailable, "The assistant didn't respond. Please try again.");
  }

  return new Response(upstream.body.pipeThrough(sseToText()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** OpenAI-style SSE (`data: {choices:[{delta:{content}}]}`) → the reply's plain text. */
function sseToText() {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        // Skips blank lines and ": OPENROUTER PROCESSING" keep-alive comments.
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const text = JSON.parse(data)?.choices?.[0]?.delta?.content;
          if (typeof text === "string" && text) controller.enqueue(encoder.encode(text));
        } catch {
          // A malformed event is dropped rather than breaking the whole reply.
        }
      }
    },
  });
}
