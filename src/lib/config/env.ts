/**
 * Zod-validated environment access.
 *
 * - Never read `process.env` anywhere else. Import `env` / `getServerEnv()` from here.
 * - Reference every NEXT_PUBLIC_* var as a literal below so Next inlines it at build time.
 * - Adding a var means editing the schema here and `.env.example`.
 */
import { z } from "zod";

/* ── Public: inlined into the browser bundle. Never put a secret here. ────── */

const publicSchema = z.object({
  /** Canonical origin of the site. Used for metadataBase and absolute URLs. */
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

const parsedPublic = publicSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsedPublic.success) {
  const message =
    "Invalid public environment variables: " +
    JSON.stringify(z.flattenError(parsedPublic.error).fieldErrors);
  // Hard-fail a production build; warn and fall back to defaults in dev.
  if (process.env.NODE_ENV === "production") throw new Error(message);
  console.warn(message);
}

export const env = parsedPublic.success ? parsedPublic.data : publicSchema.parse({});

/* ── Server only: never call getServerEnv() from a Client Component. ──────── */

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /** Resend API key for the contact form. Unset in production = contact disabled. */
  RESEND_API_KEY: z.string().min(1).optional(),
  /** Inbox that receives contact-form messages. */
  CONTACT_TO_EMAIL: z.email().optional(),
  /** Sender on a domain verified in Resend. */
  CONTACT_FROM_EMAIL: z.string().min(1).default("Portfolio <onboarding@resend.dev>"),
});

let cachedServerEnv: z.infer<typeof serverSchema> | null = null;

export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() was called in the browser.");
  }
  if (cachedServerEnv) return cachedServerEnv;

  const parsed = serverSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || undefined,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL || undefined,
  });

  if (!parsed.success) {
    throw new Error(
      "Invalid server environment variables: " +
        JSON.stringify(z.flattenError(parsed.error).fieldErrors),
    );
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}
