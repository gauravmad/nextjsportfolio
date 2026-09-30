"use client";

import { useRef } from "react";

import { education, experience } from "@/content/portfolio";
import { gsap, MOTION, useGSAP } from "@/lib/motion/gsap";

export function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        // The timeline wire fills as you read down it.
        gsap.fromTo(
          "[data-timeline-fill]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-timeline]", start: "top 60%", end: "bottom 60%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      id="experience"
      ref={root}
      tabIndex={-1}
      aria-labelledby="experience-title"
      className="grid gap-12 px-4 py-28 sm:px-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 lg:pl-40 lg:pr-16"
    >
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2 id="experience-title" className="type-title text-[clamp(2.75rem,6vw,5.5rem)]">
          Where I&apos;ve shipped
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          3+ years from frontend work to leading tech for an incubator.
        </p>
        <div className="mt-8 border-l border-rule pl-4 text-sm">
          <p className="font-semibold">{education.degree}</p>
          <p className="mt-1 text-muted-foreground">{education.school}</p>
          <p className="mt-1 font-mono text-muted-foreground">
            {education.period}, {education.grade}
          </p>
        </div>
      </div>

      <ol data-timeline className="group/list relative">
        <span aria-hidden className="absolute top-2 bottom-2 left-[5px] w-px bg-rule" />
        <span
          aria-hidden
          data-timeline-fill
          className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-gradient-to-b from-signal to-packet"
        />
        {experience.map((role, index) => (
          <li
            key={role.company}
            className="relative pb-14 pl-10 transition-opacity duration-300 last:pb-0 lg:group-hover/list:opacity-45 lg:hover:!opacity-100"
          >
            <span
              aria-hidden
              className={
                index === 0
                  ? "absolute top-1.5 left-0 size-[11px] rounded-full bg-signal shadow-[0_0_14px_var(--signal)]"
                  : "absolute top-1.5 left-0 size-[11px] rounded-full border border-signal bg-ink"
              }
            />
            <p className="font-mono text-sm text-muted-foreground">
              {role.period} <span className="text-rule">/</span> {role.place}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              {role.title}
              <span className="block text-lg font-normal text-muted-foreground sm:inline sm:text-2xl">
                <span className="hidden sm:inline">, </span>
                {role.company}
              </span>
            </h3>
            <ul className="mt-4 max-w-[68ch] space-y-2 text-muted-foreground">
              {role.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-signal" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
