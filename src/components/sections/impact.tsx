"use client";

import { useRef } from "react";

import { gitStats, outcomes } from "@/content/portfolio";
import { gsap, MOTION, useGSAP } from "@/lib/motion/gsap";

export function Impact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.from("[data-outcome]", {
          opacity: 0,
          y: 16,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: "[data-outcomes]", start: "top 75%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="impact"
      ref={root}
      tabIndex={-1}
      aria-labelledby="impact-title"
      className="px-4 py-28 sm:px-8 lg:pl-40 lg:pr-16"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-end">
        <h2 id="impact-title" className="type-title text-[clamp(2.75rem,6vw,5.5rem)]">
          What changed after I shipped
        </h2>
        <p className="text-lg text-muted-foreground">
          Before and after, from things running in production. Each line says what moved and why.
        </p>
      </div>

      <div data-outcomes className="mt-14 overflow-hidden rounded-2xl border border-rule bg-panel">
        <div className="hidden grid-cols-[minmax(0,1fr)_14rem_minmax(0,1.3fr)] gap-8 border-b border-rule px-6 py-3 font-mono text-xs text-muted-foreground md:grid">
          <span>What</span>
          <span>Before → after</span>
          <span>How</span>
        </div>
        <ul>
          {outcomes.map((outcome) => (
            <li
              key={outcome.what}
              data-outcome
              className="grid gap-2 border-b border-rule px-6 py-5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_14rem_minmax(0,1.3fr)] md:items-baseline md:gap-8"
            >
              <p className="font-medium">{outcome.what}</p>
              <p className="font-mono text-[15px]">
                {outcome.before ? (
                  <>
                    <span className="text-muted-foreground">{outcome.before}</span>
                    <span className="px-2 text-muted-foreground/60">→</span>
                  </>
                ) : null}
                <span className="text-foreground">{outcome.after}</span>
              </p>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{outcome.how}</p>
            </li>
          ))}
        </ul>
      </div>

      <figure className="mt-12" aria-labelledby="throughput-caption">
        <figcaption id="throughput-caption" className="font-mono text-sm text-muted-foreground">
          <span className="text-signal">$</span> git log --author=gaurav --oneline | wc -l
        </figcaption>
        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule lg:grid-cols-4">
          {gitStats.map((stat) => (
            <div key={stat.label} className="bg-ink p-5">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="mt-1.5 font-mono text-2xl text-foreground">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </figure>
    </section>
  );
}
