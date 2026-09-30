"use client";

import { useState } from "react";

import { Kbd } from "@/components/ui/kbd";
import { profile } from "@/content/portfolio";
import { CommandMenu } from "./command-menu";
import { useScrollToSection } from "./smooth-scroll";
import { TraceRail } from "./trace-rail";

/** Everything fixed to the viewport: header, trace rail, command palette. */
export function SiteChrome() {
  const [open, setOpen] = useState(false);
  const scrollTo = useScrollToSection();

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-md bg-signal px-3 py-2 font-medium text-ink focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => scrollTo("top")}
          className="pointer-events-auto rounded-md font-mono text-sm text-foreground"
          aria-label={`${profile.name}, back to top`}
        >
          <span className="text-signal">~/</span>gaurav
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto flex items-center gap-2 rounded-lg border border-rule bg-ink/70 px-3 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur transition-colors hover:border-muted-foreground hover:text-foreground"
        >
          <span className="hidden sm:inline">Jump to</span>
          <span className="sm:hidden">Menu</span>
          <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
        </button>
      </header>

      <TraceRail />
      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  );
}
