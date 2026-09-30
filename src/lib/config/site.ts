/** Brand + metadata constants. Every title, OG tag, and footer reads from here. */
import { env } from "./env";

export const siteConfig = {
  name: "Gaurav Madan",
  description: "Portfolio of Gaurav Madan",
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: "en_US",
} as const;
