// Public surface of the contact feature. Import from "@/features/contact" only.
export { contactSchema, type ContactFormValues, type ContactInput } from "./schemas";
export { sendContactMessage, type ContactReceipt } from "./services/contact.service";
export { useSendContact } from "./hooks/use-send-contact";
