"use client";

import { useRef, useState } from "react";

import { sections, type SectionId } from "@/content/portfolio";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";
import { useScrollToSection } from "./smooth-scroll";

/**
 * Fixed pipeline on the left edge (desktop). Each section is a stage; the
 * stage you're reading lights up, and the wire fills with overall progress.
 */
export function TraceRail() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<SectionId>("top");
  const scrollTo = useScrollToSection();

  useGSAP(
    () => {
      // The stage is the last section whose top has passed 55% of the viewport.
      // Measured live, so pinned sections (which add scroll distance) can't skew it.
      const update = () => {
        const line = window.innerHeight * 0.55;
        let current: SectionId = sections[0].id;
        for (const { id } of sections) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) current = id;
        }
        setActive(current);
      };
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: update });

      gsap.to("[data-rail-fill]", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
    },
    { scope: root },
  );

  const activeIndex = sections.findIndex((section) => section.id === active);

  return (
    <nav
      ref={root}
      aria-label="Sections"
      className="fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative">
        <div className="absolute top-2 bottom-2 left-[5px] w-px bg-rule" />
        <div
          data-rail-fill
          className="absolute top-2 bottom-2 left-[5px] w-px origin-top scale-y-0 bg-gradient-to-b from-signal to-packet"
        />
        <ol className="relative space-y-5">
          {sections.map((section, index) => {
            const isActive = section.id === active;
            const isDone = index < activeIndex;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(section.id)}
                  aria-current={isActive ? "step" : undefined}
                  className="group flex items-center gap-3 rounded-sm font-mono text-xs"
                >
                  <span
                    className={cn(
                      "size-[11px] rounded-full border transition-all duration-300",
                      isActive
                        ? "scale-125 border-signal bg-signal shadow-[0_0_14px_var(--signal)]"
                        : isDone
                          ? "border-signal bg-ink"
                          : "border-rule bg-ink group-hover:border-muted-foreground",
                    )}
                  />
                  <span
                    className={cn(
                      "transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground/60 group-hover:text-muted-foreground",
                    )}
                  >
                    {section.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
