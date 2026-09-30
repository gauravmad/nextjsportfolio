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
  /* Contact form → AWS SES. All four unset in production = contact disabled. */
  AWS_REGION: z.string().min(1).default("ap-south-1"),
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  /** Verified SES identity the email is sent from. */
  SES_FROM_EMAIL: z.email().optional(),
  /** Inbox that receives contact-form messages. */
  CONTACT_TO_EMAIL: z.email().default("gaurav@mesaschool.co"),

  /* "Ask me anything" chat → OpenRouter (OpenAI-compatible). Unset key = chat disabled. */
  OPENROUTER_BASE_URL: z.url().default("https://openrouter.ai/api/v1"),
  OPENROUTER_MODEL: z.string().min(1).default("google/gemini-3.7-flash"),
  OPENROUTER_API_KEY: z.string().min(1).optional(),
});

let cachedServerEnv: z.infer<typeof serverSchema> | null = null;

export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() was called in the browser.");
  }
  if (cachedServerEnv) return cachedServerEnv;

  const parsed = serverSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    AWS_REGION: process.env.AWS_REGION || undefined,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || undefined,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || undefined,
    SES_FROM_EMAIL: process.env.SES_FROM_EMAIL || undefined,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || undefined,
    OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || undefined,
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || undefined,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || undefined,
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
