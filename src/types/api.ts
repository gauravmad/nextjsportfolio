/**
 * The response envelope every Route Handler speaks and the browser client
 * unwraps. Success is `{ data, meta? }`; failure is `{ error }`.
 */

export const API_ERROR_CODES = {
  validation: "VALIDATION_ERROR",
  badRequest: "BAD_REQUEST",
  payloadTooLarge: "PAYLOAD_TOO_LARGE",
  rateLimited: "RATE_LIMITED",
  unavailable: "SERVICE_UNAVAILABLE",
  network: "NETWORK_ERROR",
  timeout: "TIMEOUT",
  unknown: "INTERNAL_ERROR",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

export type ResponseMeta = Record<string, unknown>;

export interface ApiEnvelope<T> {
  data: T;
  meta?: ResponseMeta;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorEnvelope {
  error: ApiErrorBody;
}

/** Shape of `details` on a VALIDATION_ERROR — mirrors `z.flattenError`. */
export interface ValidationErrorDetails {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
}
