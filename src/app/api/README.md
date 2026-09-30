# `src/app/api`: Route Handlers

The site's server-side HTTP endpoints. Everything here runs **only on the server**,
so it may use secrets (`getServerEnv()`), and it's all public HTTP. Treat every
request as untrusted.

## Layout

```
api/
  _lib/                  private helpers (the leading _ stops Next routing it)
    api-response.ts      ok() / fail() and friends: the { data } | { error } envelope
    request.ts           parseJsonBody() (size cap + Zod) and clientIp()
    rate-limit.ts        in-memory fixed-window limiter
    mailer.ts            contact email delivery via AWS SES
    assistant-prompt.ts  chat system prompt, built only from src/content/portfolio.ts
  health/route.ts        GET  /api/health    liveness for uptime monitors
  contact/route.ts       POST /api/contact   contact form → email (SES)
  chat/route.ts          POST /api/chat      "Ask me anything" → OpenRouter, streamed
```

## The request flow

```
component → hook (features/<f>/hooks) → service (features/<f>/services)
          → api client (lib/api/client.ts) → Route Handler (app/api/<r>/route.ts)
```

Components never call `fetch`. The browser client unwraps `{ data }` and throws a
typed `ApiError` (`lib/api/http-error.ts`) for `{ error }` responses.

## Endpoints

### `GET /api/health`
`200 { data: { status: "ok", timestamp } }`, never cached.

### `POST /api/contact`
Body: `{ name, email, message, website? }`, validated by the shared
`contactSchema` in `@/features/contact` (the same rules the form uses).

| Status | `error.code` | When |
|---|---|---|
| 202 | – | Accepted: `{ data: { received: true } }` |
| 400 | `BAD_REQUEST` | Body isn't JSON |
| 413 | `PAYLOAD_TOO_LARGE` | Body over 16 KB |
| 422 | `VALIDATION_ERROR` | `details` = `z.flattenError` output |
| 429 | `RATE_LIMITED` | Over 5 per 10 min per IP; see `Retry-After` |
| 503 | `SERVICE_UNAVAILABLE` | SES not configured in production |
| 500 | `INTERNAL_ERROR` | Delivery failed |

`website` is a honeypot: if it's filled in, the route answers 202 and drops the message.

### `POST /api/chat`
Body: `{ messages: [{ role, content }] }`, at most 12 messages, each question
under 600 characters, the last one from the user (`chatRequestSchema` in
`@/features/chat`). Rate-limited to 20 per 10 minutes per IP.

On success it streams the reply as `text/plain` (the one exception to the JSON
envelope). Anything that fails *before* streaming still returns `{ error }`, so
`api.stream()` throws a normal `ApiError`. The system prompt only contains what's
in `src/content/portfolio.ts`, so the assistant can't state anything the site doesn't.

## Rules for new handlers

1. **Use the envelope.** Return `ok()` / `fail()` from `_lib/api-response`, never an ad-hoc shape.
2. **Validate with Zod on the server**, using `parseJsonBody()`. Keep the schema in
   the feature slice so the client and server share it.
3. **Never leak internals.** Log the detail with `console.error` and return a stable
   `code` plus a safe `message`.
4. **Rate-limit anything that costs money or sends mail.**
5. **Secrets come from `getServerEnv()` only**, never from a `NEXT_PUBLIC_` variable.
6. `_lib/*` is server-only (`import "server-only"`). ESLint blocks importing it from UI code.
7. Next 16: `cookies()`, `headers()` and `params` are async. Await them.
8. Add the path to `lib/api/endpoints.ts`, then consume it through a feature service.
