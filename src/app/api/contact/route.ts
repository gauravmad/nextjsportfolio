/**
 * POST /api/contact
 *
 * Accepts a contact-form submission and emails it to the site owner.
 * Pipeline: rate limit → size-capped JSON parse → Zod validation → honeypot → send.
 *
 * Responses:
 *   202 { data: { received: true } }
 *   400 BAD_REQUEST · 413 PAYLOAD_TOO_LARGE · 422 VALIDATION_ERROR
 *   429 RATE_LIMITED (+ Retry-After) · 503 SERVICE_UNAVAILABLE · 500 INTERNAL_ERROR
 */
import type { NextRequest } from "next/server";

import { contactSchema } from "@/features/contact/schemas";
import {
  badRequest,
  ok,
  payloadTooLarge,
  serverError,
  serviceUnavailable,
  tooManyRequests,
  validationError,
} from "@/app/api/_lib/api-response";
import { MailerNotConfiguredError, sendContactEmail } from "@/app/api/_lib/mailer";
import { rateLimit } from "@/app/api/_lib/rate-limit";
import { clientIp, parseJsonBody } from "@/app/api/_lib/request";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60_000 };

export async function POST(request: NextRequest) {
  const limit = rateLimit(`contact:${clientIp(request)}`, RATE_LIMIT);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

  const body = await parseJsonBody(request, contactSchema);
  if (!body.ok) {
    if (body.reason === "too_large") return payloadTooLarge();
    if (body.reason === "malformed") return badRequest("Request body must be valid JSON.");
    return validationError(body.details);
  }

  const { website, ...message } = body.data;
  const accepted = ok({ received: true }, { status: 202 });

  // Honeypot tripped: answer exactly like a success so bots learn nothing.
  if (website) return accepted;

  try {
    await sendContactEmail(message);
    return accepted;
  } catch (error) {
    if (error instanceof MailerNotConfiguredError) {
      console.error("[contact]", error.message);
      return serviceUnavailable("The contact form is temporarily unavailable.");
    }
    console.error("[contact] delivery failed:", error);
    return serverError("We couldn't send your message. Please try again later.");
  }
}
