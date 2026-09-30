/**
 * Contact-form schema, shared by the form (client) and POST /api/contact (server)
 * so both sides validate against exactly the same rules.
 */
import { z } from "zod";

/** Strip CR/LF so a name can't inject extra lines into the email subject. */
const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

export const contactSchema = z.object({
  name: z
    .string()
    .transform(singleLine)
    .pipe(z.string().min(2, "Please enter your name.").max(100, "Name is too long.")),
  email: z.string().trim().pipe(z.email("Please enter a valid email address.").max(254)),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(5000, "Message is too long (5,000 characters max)."),
  /**
   * Honeypot. Rendered as a visually hidden field that people never fill in;
   * bots usually do. The route accepts and silently drops those submissions.
   */
  website: z.string().max(200).optional(),
});

/** What the form holds (before transforms). */
export type ContactFormValues = z.input<typeof contactSchema>;
/** What the server works with (after transforms). */
export type ContactInput = z.output<typeof contactSchema>;
