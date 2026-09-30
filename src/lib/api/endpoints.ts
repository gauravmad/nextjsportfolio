/**
 * Every API path in one place. Services import from here, never inline a path,
 * so a route rename is a single-file change. All paths are same-origin Route Handlers.
 */
export const ENDPOINTS = {
  health: "/api/health",
  contact: "/api/contact",
} as const;
