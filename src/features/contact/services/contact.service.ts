/** Contact API calls. Plain async functions: no React, so they're easy to test. */
import { api } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ContactFormValues } from "../schemas";

export interface ContactReceipt {
  received: true;
}

export function sendContactMessage(values: ContactFormValues) {
  return api.post<ContactReceipt>(ENDPOINTS.contact, values);
}
