/**
 * GET /api/health
 *
 * Liveness check for uptime monitors. Always 200 while the app is serving;
 * never cached (GET Route Handlers are dynamic by default in Next 16).
 */
import { ok } from "@/app/api/_lib/api-response";

export function GET() {
  return ok(
    { status: "ok", timestamp: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
