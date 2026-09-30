"use client";

import { animate, stagger } from "animejs";
import { useRef } from "react";

import { deployments } from "@/content/portfolio";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

export function Deployments() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const rows = root.current!.querySelectorAll<HTMLElement>("[data-deploy-row]");
        gsap.set(rows, { opacity: 0 });
        ScrollTrigger.create({
          trigger: "[data-deploy-table]",
          start: "top 75%",
          once: true,
          // Rows print in like CLI output, then each status dot comes up green.
          onEnter: () => {
            animate(rows, { opacity: [0, 1], delay: stagger(70), duration: 260 });
            animate(root.current!.querySelectorAll("[data-deploy-dot]"), {
              scale: [0, 1],
              delay: stagger(70, { start: 200 }),
              duration: 400,
              ease: "outBack",
            });
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="live"
      ref={root}
      tabIndex={-1}
      aria-labelledby="live-title"
      className="px-4 py-28 sm:px-8 lg:pl-40 lg:pr-16"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-end">
        <h2 id="live-title" className="type-title text-[clamp(2.75rem,6vw,5.5rem)]">
          Live right now
        </h2>
        <p className="max-w-[44ch] text-lg text-muted-foreground">
          Products I built or led at Mesa, serving real users today. Each one is a link.
        </p>
      </div>

      <div data-deploy-table className="mt-12 overflow-hidden rounded-xl border border-rule bg-panel font-mono text-sm">
        <p className="overflow-x-auto border-b border-rule px-5 py-3 whitespace-nowrap text-muted-foreground">
          <span className="text-signal">$</span> xargs -I% curl -so /dev/null -w &quot;%{'{'}http_code{'}'}&quot; https://% &lt; deployed.txt
        </p>
        <table className="w-full border-collapse text-left">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 pt-4 pb-2 font-normal">HTTP</th>
              <th scope="col" className="hidden px-5 pt-4 pb-2 font-normal sm:table-cell">Service</th>
              <th scope="col" className="hidden px-5 pt-4 pb-2 font-normal md:table-cell">What it does</th>
              <th scope="col" className="px-5 pt-4 pb-2 font-normal">URL</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((deployment) => (
              <tr key={deployment.name} data-deploy-row className="border-t border-rule/60 transition-colors hover:bg-ink/60">
                <td className="px-5 py-3">
                  <span className="flex items-center gap-2 text-[#4ade80]">
                    <span data-deploy-dot className="size-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]" />
                    <span>200</span>
                  </span>
                </td>
                <td className="hidden px-5 py-3 text-foreground sm:table-cell">{deployment.name}</td>
                <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{deployment.what}</td>
                <td className="px-5 py-3">
                  <span className="block text-foreground sm:hidden">{deployment.name}</span>
                  <a
                    href={`https://${deployment.host}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs break-words text-packet sm:text-sm underline decoration-rule underline-offset-4 hover:decoration-packet"
                  >
                    {deployment.host}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
