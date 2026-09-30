"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
      mutations: { retry: 0 },
    },
  });
}

/** Every client-side provider, composed once and mounted by the root layout. */
export function Providers({ children }: { children: React.ReactNode }) {
  // One QueryClient per browser session, never shared between requests.
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Toaster>
          <TooltipProvider>{children}</TooltipProvider>
        </Toaster>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
