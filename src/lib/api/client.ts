/**
 * The ONLY place in the app that calls `fetch` against our API.
 *
 * - Unwraps the `{ data, meta }` envelope so callers get the payload.
 * - Throws a typed `ApiError` for `{ error }` responses, timeouts and network failures.
 *
 * Components never call this directly: component → hook → service → api.
 */
import { API_ERROR_CODES, type ApiEnvelope } from "@/types/api";
import { ApiError } from "./http-error";

export interface RequestOptions extends Omit<RequestInit, "body" | "method"> {
  /** Abort after N ms. Defaults to 15s. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;

async function request<T>(
  path: string,
  method: string,
  body: unknown,
  { timeoutMs = DEFAULT_TIMEOUT_MS, headers, signal, ...rest }: RequestOptions = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...rest,
      method,
      signal: signal ?? AbortSignal.timeout(timeoutMs),
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "TimeoutError") {
      throw new ApiError(0, API_ERROR_CODES.timeout, "The request timed out.", cause);
    }
    throw ApiError.network(cause);
  }

  if (!response.ok) throw await ApiError.fromResponse(response);
  if (response.status === 204) return undefined as T;

  const envelope = (await response.json()) as ApiEnvelope<T>;
  return envelope.data;
}

/**
 * POST and read a streamed plain-text response chunk by chunk. Errors before
 * the stream starts still arrive as the `{ error }` envelope → `ApiError`.
 */
async function* stream(path: string, body: unknown, { signal }: { signal?: AbortSignal } = {}) {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      signal,
      headers: { Accept: "text/plain", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") return;
    throw ApiError.network(cause);
  }
  if (!response.ok || !response.body) throw await ApiError.fromResponse(response);

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, "GET", undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, "POST", body, options),
  stream,
};
