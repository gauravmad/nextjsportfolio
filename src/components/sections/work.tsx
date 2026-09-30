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
      className="group/panel relative isolate flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-rule bg-panel transition-colors hover:border-foreground/20 lg:h-[min(72vh,700px)] lg:w-[min(calc((100vw-16rem)/2),720px)]"
    >
      {/* Screenshot on top, fading down into the card so the copy sits on black. */}
      <div className="relative aspect-16/9 w-full shrink-0 overflow-hidden lg:aspect-auto lg:h-[50%]">
        <div data-shot className="absolute -inset-x-[4%] inset-y-0 mask-[linear-gradient(to_bottom,black_45%,transparent)]">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-top-left opacity-75 transition-[opacity,scale] duration-700 group-hover/panel:scale-[1.03] group-hover/panel:opacity-90"
            priority={index < 2}
          />
        </div>
        <div className="absolute top-3 right-3">
          <AddressBar host={project.host} />
        </div>
      </div>

      <div className="relative -mt-10 flex flex-1 flex-col gap-5 px-6 pb-6 sm:px-8 sm:pb-8">
        <header data-reveal>
          <p className="font-mono text-xs text-muted-foreground">
            {String(index + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")} <span className="text-rule">·</span>{" "}
            {project.kind}
          </p>
          <h3 id={`project-${project.slug}-title`} className="type-title mt-2 text-[clamp(2.25rem,3.2vw,3.25rem)]">
            {project.name}
          </h3>
          <p className="mt-3 leading-relaxed text-foreground/85">{project.summary}</p>
        </header>

        <ul data-reveal className="grid gap-x-5 gap-y-1.5 font-mono text-[12.5px] text-foreground/90 sm:grid-cols-2">
          {project.specs.map((spec) => (
            <li key={spec} className="flex gap-2">
              <span aria-hidden className="text-ok">✓</span>
              {spec}
            </li>
          ))}
        </ul>

        <footer data-reveal className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-rule pt-4">
          <p className="min-w-0 flex-1 font-mono text-[11.5px] leading-relaxed text-muted-foreground">
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
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rule px-3 py-1.5 text-sm font-medium transition-colors hover:border-foreground/40"
          >
            Open
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span className="sr-only">{project.name} (opens in a new tab)</span>
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

        gsap.utils.toArray<HTMLElement>("[data-panel]", el).forEach((panel) => {
          // Screenshots drift against the slide, so they read as a layer behind the copy.
          gsap.fromTo(
            panel.querySelector("[data-shot]"),
            { xPercent: 3 },
            {
              xPercent: -3,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
            },
          );
          // Panels already on screen when the pin starts (two at a time) reveal on
          // vertical scroll; the rest reveal as they slide in from the right.
          const trigger =
            panel.offsetLeft + panel.offsetWidth / 2 < window.innerWidth
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
          Four products I built end to end, all live today. Keep scrolling to move through them.
        </p>
      </div>

      {/* Panels fade out before they slide under the fixed trace rail. */}
      <div className="lg:mask-[linear-gradient(to_right,transparent_0,transparent_96px,black_152px)]">
        <div ref={track} className="flex flex-col gap-6 px-4 sm:px-8 lg:w-max lg:flex-row lg:gap-8 lg:pl-40 lg:pr-16">
          {projects.map((project, index) => (
            <ProjectPanel key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
