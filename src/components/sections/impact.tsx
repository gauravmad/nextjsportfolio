"use client";

import { animate, scrambleText } from "animejs";
import { useRef } from "react";

import { gitStats, metrics } from "@/content/portfolio";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

export function Impact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-metric]", root.current);
        rows.forEach((row) => {
          const value = row.querySelector<HTMLElement>("[data-metric-value]");
          const bar = row.querySelector<HTMLElement>("[data-metric-bar]");
          gsap.set(row, { opacity: 0.2 });
          ScrollTrigger.create({
            trigger: row,
            start: "top 78%",
            once: true,
            onEnter: () => {
              gsap.to(row, { opacity: 1, duration: 0.5 });
              if (bar) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.out" });
              // Numbers decode like a query result coming back.
              if (value) animate(value, { innerHTML: scrambleText({ chars: "0-9₹×~–", cursor: false }), duration: 1100 });
            },
          });
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
      <div className="mb-16 grid gap-6 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-end">
        <h2 id="impact-title" className="type-title text-[clamp(2.75rem,7vw,6.5rem)]">
          What changed
          <br />
          after I shipped
        </h2>
        <p className="max-w-[44ch] text-lg leading-relaxed text-muted-foreground">
          Every number here is a before and after from something in production, not a projection. The engineering behind each one is further down.
        </p>
      </div>

      <ol className="border-t border-rule">
        {metrics.map((metric) => (
          <li
            key={metric.label}
            data-metric
            className="grid gap-3 border-b border-rule py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:gap-10"
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              {metric.before ? (
                <span className="font-mono text-xl text-muted-foreground line-through decoration-signal/70 sm:text-2xl">
                  {metric.before}
                </span>
              ) : null}
              <span data-metric-value className="type-display text-[clamp(3.5rem,9vw,7.5rem)] text-foreground">
                {metric.value}
              </span>
            </div>
            <div>
              <p className="text-xl font-semibold">{metric.label}</p>
              <p className="mt-1 max-w-[52ch] text-muted-foreground">{metric.context}</p>
              <div data-metric-bar className="mt-4 h-px origin-left bg-gradient-to-r from-signal via-packet to-transparent" />
            </div>
          </li>
        ))}
      </ol>

      <figure className="mt-16" aria-labelledby="throughput-caption">
        <figcaption id="throughput-caption" className="font-mono text-sm text-muted-foreground">
          <span className="text-signal">$</span> git log --author=gaurav --oneline | wc -l
        </figcaption>
        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule lg:grid-cols-4">
          {gitStats.map((stat) => (
            <div key={stat.label} className="bg-ink p-5 sm:p-6">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="mt-2 font-mono text-3xl text-foreground sm:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </figure>
    </section>
  );
}
