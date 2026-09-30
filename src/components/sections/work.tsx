"use client";

import { useRef } from "react";

import { projects, type Project } from "@/content/portfolio";
import { gsap, MOTION, useGSAP } from "@/lib/motion/gsap";

function Pipeline({ stages }: { stages: string[] }) {
  return (
    <ol aria-label="Architecture" className="flex flex-wrap items-center gap-y-3 font-mono text-xs sm:text-sm">
      {stages.map((stage, index) => (
        <li key={stage} className="flex items-center">
          {index > 0 ? (
            <span aria-hidden className="relative mx-2 block h-px w-5 overflow-hidden bg-rule sm:w-8">
              <span data-wire className="absolute inset-0 origin-left bg-signal" />
              <span className="absolute top-1/2 left-0 size-1 -translate-y-1/2 animate-[packet_1.6s_linear_infinite] rounded-full bg-packet" />
            </span>
          ) : null}
          <span
            data-node
            className="rounded-md border border-rule bg-ink px-2.5 py-1.5 text-foreground first:border-signal/60"
          >
            {stage}
          </span>
        </li>
      ))}
    </ol>
  );
}

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  return (
    <article
      id={`project-${project.slug}`}
      data-panel
      aria-labelledby={`project-${project.slug}-title`}
      className="relative flex w-full shrink-0 flex-col justify-between gap-10 rounded-2xl border border-rule bg-panel/80 p-6 sm:p-10 lg:h-[min(70vh,700px)] lg:w-[min(80vw,1120px)]"
    >
      <header className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:gap-6">
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
          <h3 id={`project-${project.slug}-title`} className="type-title mt-3 text-[clamp(2.25rem,4.6vw,4.25rem)]">
            {project.name}
          </h3>
          <p className="mt-3 max-w-[48ch] text-lg text-muted-foreground">{project.summary}</p>
        </div>
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-lg border border-rule px-3 py-2 font-mono text-xs text-foreground transition-colors hover:border-signal hover:text-signal"
          >
            Visit live site<span className="sr-only"> for {project.name} (opens in a new tab)</span>
          </a>
        ) : null}
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div data-reveal>
          <p className="type-display text-[clamp(3.5rem,8vw,7rem)] text-signal">{project.outcome.value}</p>
          <p className="mt-2 text-lg font-semibold">{project.outcome.label}</p>
        </div>
        <div data-reveal className="space-y-5">
          <p className="max-w-[60ch] leading-relaxed text-muted-foreground">{project.detail}</p>
          <ul className="grid gap-x-6 gap-y-2 font-mono text-sm sm:grid-cols-2">
            {project.specs.map((spec) => (
              <li key={spec} className="flex gap-2">
                <span aria-hidden className="text-signal">✓</span>
                {spec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="space-y-5">
        <Pipeline stages={project.pipeline} />
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-packet">stack</span> = [{project.stack.map((s) => `"${s}"`).join(", ")}]
        </p>
      </footer>
    </article>
  );
}

export function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pin the section and move the panels sideways with the scroll.
      mm.add(MOTION.desktop, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth + 64;
        const slide = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-panel]", el).forEach((panel, index) => {
          // The first panel is already in view when the pin starts, so it reveals on
          // vertical scroll; the rest reveal as they slide in from the right.
          const trigger =
            index === 0
              ? { trigger: root.current, start: "top 60%", toggleActions: "play none none reverse" }
              : { trigger: panel, containerAnimation: slide, start: "left 75%", toggleActions: "play none none reverse" };
          gsap.from(panel.querySelectorAll("[data-wire]"), { scaleX: 0, duration: 0.5, stagger: 0.12, ease: "power2.out", scrollTrigger: trigger });
          gsap.from(panel.querySelectorAll("[data-node]"), { opacity: 0, y: 10, duration: 0.4, stagger: 0.12, scrollTrigger: trigger });
          gsap.from(panel.querySelectorAll("[data-reveal]"), { opacity: 0, y: 30, duration: 0.8, stagger: 0.1, ease: "expo.out", scrollTrigger: trigger });
        });
      });

      // Mobile and tablet: panels stack; the diagrams still draw in as they arrive.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-panel]", track.current).forEach((panel) => {
          const trigger = { trigger: panel, start: "top 70%" };
          gsap.from(panel.querySelectorAll("[data-wire]"), { scaleX: 0, duration: 0.5, stagger: 0.1, scrollTrigger: trigger });
          gsap.from(panel.querySelectorAll("[data-node]"), { opacity: 0, duration: 0.4, stagger: 0.1, scrollTrigger: trigger });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="work"
      ref={root}
      tabIndex={-1}
      aria-labelledby="work-title"
      className="overflow-hidden py-24 lg:flex lg:h-dvh lg:flex-col lg:justify-center lg:py-0"
    >
      <div className="mb-10 px-4 sm:px-8 lg:mb-8 lg:pl-40 lg:pr-16">
        <h2 id="work-title" className="type-title text-[clamp(2.75rem,6vw,5.5rem)]">
          Systems in production
        </h2>
        <p className="mt-3 max-w-[56ch] text-lg text-muted-foreground">
          Outcome first, then the architecture that earns it. Each diagram is the real request path.
        </p>
      </div>

      {/* Panels fade out before they slide under the fixed trace rail. */}
      <div className="lg:[mask-image:linear-gradient(to_right,transparent_0,transparent_150px,black_230px)]">
      <div
        ref={track}
        className="flex flex-col gap-6 px-4 sm:px-8 lg:w-max lg:flex-row lg:gap-8 lg:pl-40 lg:pr-16"
      >
        {projects.map((project, index) => (
          <ProjectPanel key={project.slug} project={project} index={index} />
        ))}
      </div>
      </div>
    </section>
  );
}
