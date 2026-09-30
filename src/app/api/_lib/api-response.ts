/**
 * Response helpers for Route Handlers.
 *
 * Every handler speaks the same envelope, `{ data, meta }` or `{ error }`, so
 * `@/lib/api/client` can consume any of them without special cases. Never
 * return `NextResponse.json(...)` with an ad-hoc shape from a route.
 */
import { NextResponse } from "next/server";

import { API_ERROR_CODES, type ResponseMeta } from "@/types/api";

export function ok<T>(data: T, init?: { meta?: ResponseMeta; status?: number; headers?: HeadersInit }) {
  const { meta, status = 200, headers } = init ?? {};
  return NextResponse.json({ data, ...(meta ? { meta } : {}) }, { status, headers });
}

export function fail(
  status: number,
  code: string,
  message: string,
  init?: { details?: unknown; headers?: HeadersInit },
) {
  const { details, headers } = init ?? {};
  return NextResponse.json(
    { error: { code, message, ...(details ? { details } : {}) } },
    { status, headers },
  );
}

export const validationError = (details: unknown, message = "Some fields are invalid.") =>
  fail(422, API_ERROR_CODES.validation, message, { details });

export const badRequest = (message = "Malformed request.") =>
  fail(400, API_ERROR_CODES.badRequest, message);

export const payloadTooLarge = (message = "Request body is too large.") =>
  fail(413, API_ERROR_CODES.payloadTooLarge, message);

export const tooManyRequests = (retryAfterSeconds: number) =>
  fail(429, API_ERROR_CODES.rateLimited, "Too many requests. Please try again later.", {
    headers: { "Retry-After": String(retryAfterSeconds) },
  });

export const serviceUnavailable = (message = "This service is temporarily unavailable.") =>
  fail(503, API_ERROR_CODES.unavailable, message);

export const serverError = (message = "Unexpected server error.") =>
  fail(500, API_ERROR_CODES.unknown, message);
