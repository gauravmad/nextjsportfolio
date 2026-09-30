"use client";

import { useMutation } from "@tanstack/react-query";

import { sendContactMessage } from "../services/contact.service";

/** Mutation for the contact form. Errors arrive as `ApiError` (see `.fieldErrors`). */
export function useSendContact() {
  return useMutation({ mutationFn: sendContactMessage });
}
