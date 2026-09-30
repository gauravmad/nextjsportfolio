/** Request parsing helpers for Route Handlers. */
import "server-only";

import type { NextRequest } from "next/server";
import { z } from "zod";

type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "too_large" }
  | { ok: false; reason: "malformed" }
  | { ok: false; reason: "invalid"; details: ReturnType<typeof z.flattenError> };

/**
 * Read a JSON body with a hard size cap, then validate it with Zod.
 * Server-side validation is mandatory: a client-side check proves nothing
 * about what actually arrived.
 */
export async function parseJsonBody<S extends z.ZodType>(
  request: NextRequest,
  schema: S,
  { maxBytes = 16 * 1024 } = {},
): Promise<ParseResult<z.infer<S>>> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxBytes) return { ok: false, reason: "too_large" };

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { ok: false, reason: "malformed" };
  }
  // Content-Length can be absent or wrong, so check the real size too.
  if (new TextEncoder().encode(raw).byteLength > maxBytes) {
    return { ok: false, reason: "too_large" };
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "malformed" };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return { ok: false, reason: "invalid", details: z.flattenError(parsed.error) };
  }
  return { ok: true, data: parsed.data };
}

/**
 * Best-effort client IP for rate limiting. On Vercel, `x-forwarded-for` is set
 * by the platform edge and its first entry is the real client.
 */
export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
