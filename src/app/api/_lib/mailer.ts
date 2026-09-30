/**
 * Sends contact-form messages through Resend's REST API (no SDK needed).
 *
 * Not configured (no RESEND_API_KEY / CONTACT_TO_EMAIL):
 *   - development: logs the message and succeeds, so the form works locally.
 *   - production:  throws MailerNotConfiguredError, and the route answers 503.
 */
import "server-only";

import { getServerEnv } from "@/lib/config/env";
import type { ContactInput } from "@/features/contact/schemas";

export class MailerNotConfiguredError extends Error {
  constructor() {
    super("Contact email delivery is not configured.");
    this.name = "MailerNotConfiguredError";
  }
}

export class MailerDeliveryError extends Error {
  constructor(readonly status: number, readonly body: string) {
    super(`Resend responded ${status}`);
    this.name = "MailerDeliveryError";
  }
}

const RESEND_URL = "https://api.resend.com/emails";

export async function sendContactEmail(message: ContactInput): Promise<void> {
  const { NODE_ENV, RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = getServerEnv();

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    if (NODE_ENV !== "production") {
      console.info("[contact] mailer not configured; message not sent:", message);
      return;
    }
    throw new MailerNotConfiguredError();
  }

  // Plain text only: user input never gets rendered as HTML in the inbox.
  const response = await fetch(RESEND_URL, {
    method: "POST",
    signal: AbortSignal.timeout(10_000),
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: message.email,
      subject: `Portfolio enquiry from ${message.name}`,
      text: `Name: ${message.name}\nEmail: ${message.email}\n\n${message.message}`,
    }),
  });

  if (!response.ok) {
    throw new MailerDeliveryError(response.status, await response.text());
  }
}
