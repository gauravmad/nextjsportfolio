"use client";

import { useRef } from "react";

import { manifesto } from "@/content/portfolio";
import { gsap, MOTION, SplitText, useGSAP } from "@/lib/motion/gsap";

export function Approach() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const split = SplitText.create("[data-manifesto]", { type: "words" });
        // Pinned while the reader's eye moves through it: each word lights as it's reached.
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=130%",
              scrub: true,
              pin: true,
            },
          },
        );
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section
      id="approach"
      ref={root}
      tabIndex={-1}
      aria-labelledby="approach-title"
      className="flex min-h-dvh items-center px-4 py-24 sm:px-8 lg:pl-40 lg:pr-16"
    >
      <div className="max-w-6xl">
        <h2 id="approach-title" className="mb-10 font-mono text-sm text-muted-foreground">
          <span className="text-signal">router</span>.decide(what_to_build)
        </h2>
        <p data-manifesto className="type-title text-[clamp(2rem,5.2vw,4.75rem)] text-foreground">
          {manifesto}
        </p>
      </div>
    </section>
  );
}
