"use client";

import { animate, stagger } from "animejs";
import { useRef } from "react";

import { engineeringConfig, skills } from "@/content/portfolio";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

export function Stack() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const lines = root.current!.querySelectorAll<HTMLElement>("[data-code-line]");
        gsap.set(lines, { opacity: 0 });
        ScrollTrigger.create({
          trigger: "[data-code]",
          start: "top 70%",
          once: true,
          // The config file "writes itself", one line at a time.
          onEnter: () =>
            animate(lines, { opacity: [0, 1], translateX: [-8, 0], delay: stagger(110), duration: 420, ease: "outExpo" }),
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="stack"
      ref={root}
      tabIndex={-1}
      aria-labelledby="stack-title"
      className="px-4 py-28 sm:px-8 lg:pl-40 lg:pr-16"
    >
      <h2 id="stack-title" className="type-title text-[clamp(2.75rem,6vw,5.5rem)]">
        How I build
      </h2>
      <p className="mt-4 max-w-[56ch] text-lg text-muted-foreground">
        The defaults I bring to every product, as the config file I actually work from.
      </p>

      <div className="mt-14 grid gap-10 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <figure data-code className="self-start overflow-hidden rounded-xl border border-rule bg-panel">
          <div className="flex items-center gap-2 border-b border-rule bg-[linear-gradient(90deg,#1f2937,#111827)] px-4 py-3">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
            <figcaption className="ml-3 font-mono text-xs text-muted-foreground">engineering.config.ts</figcaption>
          </div>
          <pre className="p-5 font-mono text-[13px] leading-7 whitespace-pre-wrap sm:p-7 sm:text-sm">
            <code>
              <span data-code-line className="block">
                <span className="text-[#c084fc]">export const</span> <span className="text-packet">howIBuild</span> = {"{"}
              </span>
              {engineeringConfig.map(([key, value]) => (
                <span key={key} data-code-line className="block [padding-left:calc(1.5rem+1.5ch)] [text-indent:-1.5ch]">
                  <span className="text-[#7dd3fc]">{key}</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-[#fdba74]">&quot;{value}&quot;</span>
                  <span className="text-muted-foreground">,</span>
                </span>
              ))}
              <span data-code-line className="block">
                {"}"} <span className="text-[#c084fc]">as const</span>;
              </span>
            </code>
          </pre>
        </figure>

        <dl className="grid content-start gap-8 sm:grid-cols-2 xl:grid-cols-1">
          {skills.map((group) => (
            <div key={group.group}>
              <dt className="font-semibold">{group.group}</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-md border border-rule px-2 py-1 font-mono text-xs text-muted-foreground">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
