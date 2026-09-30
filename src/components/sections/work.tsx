"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { projects, type Project } from "@/content/portfolio";
import { gsap, MOTION, useGSAP } from "@/lib/motion/gsap";

/** A browser address bar over the screenshot: the product's real, live host. */
function AddressBar({ host }: { host: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-rule bg-ink/80 px-3 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
      <span className="size-1.5 rounded-full bg-ok shadow-[0_0_6px_var(--ok)]" />
      <span className="text-foreground">{host}</span>
      <span className="text-muted-foreground/60">200</span>
    </div>
  );
}

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  return (
    <article
      id={`project-${project.slug}`}
      data-panel
      aria-labelledby={`project-${project.slug}-title`}
      className="relative isolate flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-rule bg-panel lg:h-[min(76vh,760px)] lg:w-[min(86vw,1320px)] lg:flex-row"
    >
      {/* Screenshot: full-bleed on desktop, fading left into the panel behind the copy. */}
      <div className="relative aspect-16/10 w-full lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[68%]">
        <div
          data-shot
          className="absolute inset-0 mask-[linear-gradient(to_top,transparent,black_35%)] lg:inset-x-[-4%] lg:mask-[linear-gradient(to_right,transparent_0%,transparent_12%,black_55%),linear-gradient(to_top,transparent_0%,black_30%)] lg:mask-intersect"
        >
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-top-left opacity-70"
            priority={index === 0}
          />
        </div>
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
          <AddressBar host={project.host} />
        </div>
      </div>

      <div className="relative flex flex-col justify-between gap-8 p-6 sm:p-10 lg:w-[46%] lg:max-w-136">
        <header data-reveal>
          <p className="font-mono text-xs text-muted-foreground">
            {String(index + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")} <span className="text-rule">·</span>{" "}
            {project.kind}
          </p>
          <h3 id={`project-${project.slug}-title`} className="type-title mt-3 text-[clamp(2.5rem,4.8vw,4.5rem)]">
            {project.name}
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-foreground/85">{project.summary}</p>
        </header>

        <div data-reveal className="space-y-5">
          <p className="text-[15px] leading-relaxed text-muted-foreground">{project.detail}</p>
          <ul className="space-y-1.5 font-mono text-[13px]">
            {project.specs.map((spec) => (
              <li key={spec} className="flex gap-2.5">
                <span aria-hidden className="text-ok">✓</span>
                {spec}
              </li>
            ))}
          </ul>
        </div>

        <footer data-reveal className="space-y-4">
          <p className="font-mono text-xs leading-relaxed text-muted-foreground">
            <span className="text-syntax-keyword">stack</span> = [
            {project.stack.map((item, i) => (
              <span key={item}>
                <span className="text-syntax-string">&quot;{item}&quot;</span>
                {i < project.stack.length - 1 ? ", " : ""}
              </span>
            ))}
            ]
          </p>
          <a
            href={`https://${project.host}`}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-rule underline-offset-4 transition-colors hover:decoration-signal"
          >
            Open {project.name}
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </footer>
      </div>
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
          // Screenshots drift against the slide, so they read as a layer behind the copy.
          gsap.fromTo(
            panel.querySelector("[data-shot]"),
            { xPercent: 4 },
            {
              xPercent: -4,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
            },
          );
          // The first panel is in view when the pin starts; the rest reveal as they slide in.
          const trigger =
            index === 0
              ? { trigger: root.current, start: "top 60%", toggleActions: "play none none reverse" }
              : { trigger: panel, containerAnimation: slide, start: "left 70%", toggleActions: "play none none reverse" };
          gsap.from(panel.querySelectorAll("[data-reveal]"), { opacity: 0, y: 24, duration: 0.8, stagger: 0.1, ease: "expo.out", scrollTrigger: trigger });
        });
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-panel]", track.current).forEach((panel) => {
          gsap.from(panel.querySelectorAll("[data-reveal]"), { opacity: 0, y: 20, duration: 0.7, stagger: 0.08, scrollTrigger: { trigger: panel, start: "top 75%" } });
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
      <div className="mb-10 flex flex-col gap-3 px-4 sm:px-8 lg:mb-8 lg:flex-row lg:items-end lg:justify-between lg:pl-40 lg:pr-16">
        <h2 id="work-title" className="type-title text-[clamp(2.75rem,6vw,5.5rem)]">
          Systems in production
        </h2>
        <p className="max-w-[40ch] text-muted-foreground">
          Four products I built end to end, all live today. Scroll to move through them.
        </p>
      </div>

      {/* Panels fade out before they slide under the fixed trace rail. */}
      <div className="lg:mask-[linear-gradient(to_right,transparent_0,transparent_150px,black_230px)]">
        <div ref={track} className="flex flex-col gap-6 px-4 sm:px-8 lg:w-max lg:flex-row lg:gap-8 lg:pl-40 lg:pr-16">
          {projects.map((project, index) => (
            <ProjectPanel key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
