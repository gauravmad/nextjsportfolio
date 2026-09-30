/**
 * Sends contact-form messages through AWS SES (v2).
 *
 * Not configured (no AWS keys / SES_FROM_EMAIL):
 *   - development: logs the message and succeeds, so the form works locally.
 *   - production:  throws MailerNotConfiguredError, and the route answers 503.
 */
import "server-only";

import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";

import { getServerEnv } from "@/lib/config/env";
import type { ContactInput } from "@/features/contact/schemas";

export class MailerNotConfiguredError extends Error {
  constructor() {
    super("Contact email delivery is not configured.");
    this.name = "MailerNotConfiguredError";
  }
}

let client: SESv2Client | null = null;

function sesClient() {
  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = getServerEnv();
  client ??= new SESv2Client({
    region: AWS_REGION,
    credentials: { accessKeyId: AWS_ACCESS_KEY_ID!, secretAccessKey: AWS_SECRET_ACCESS_KEY! },
  });
  return client;
}

export async function sendContactEmail(message: ContactInput): Promise<void> {
  const { NODE_ENV, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SES_FROM_EMAIL, CONTACT_TO_EMAIL } = getServerEnv();

  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !SES_FROM_EMAIL) {
    if (NODE_ENV !== "production") {
      console.info("[contact] mailer not configured; message not sent:", message);
      return;
    }
    throw new MailerNotConfiguredError();
  }

  // Plain text only: user input never gets rendered as HTML in the inbox.
  await sesClient().send(
    new SendEmailCommand({
      FromEmailAddress: `Portfolio <${SES_FROM_EMAIL}>`,
      Destination: { ToAddresses: [CONTACT_TO_EMAIL] },
      ReplyToAddresses: [message.email],
      Content: {
        Simple: {
          Subject: { Data: `Portfolio enquiry from ${message.name}`, Charset: "UTF-8" },
          Body: {
            Text: {
              Data: `Name: ${message.name}\nEmail: ${message.email}\n\n${message.message}`,
              Charset: "UTF-8",
            },
          },
        },
      },
    }),
    { abortSignal: AbortSignal.timeout(10_000) },
  );
}
