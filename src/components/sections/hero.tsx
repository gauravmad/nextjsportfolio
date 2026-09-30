"use client";

import { animate, scrambleText } from "animejs";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { useScrollToSection } from "@/components/site/smooth-scroll";
import { HeroScene } from "@/components/three/hero-scene";
import { sceneState } from "@/components/three/scene-state";
import { profile } from "@/content/portfolio";
import { gsap, MOTION, ScrollTrigger, SplitText, useGSAP } from "@/lib/motion/gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const role = useRef<HTMLSpanElement>(null);
  const scrollTo = useScrollToSection();

  useGSAP(
    () => {
      // Scroll progress feeds the WebGL camera for everyone; it's not decorative motion.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => (sceneState.progress = self.progress),
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const name = SplitText.create("[data-hero-name]", { type: "chars", mask: "chars" });
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        intro
          .from("[data-hero-prompt]", { opacity: 0, x: -12, duration: 0.6 })
          .from(name.chars, { yPercent: 110, duration: 1.1, stagger: 0.035 }, "-=0.2")
          .from("[data-hero-reveal]", { opacity: 0, y: 18, duration: 0.9, stagger: 0.08 }, "-=0.7");

        // The copy drifts up and dims as the graph takes over the frame.
        gsap.to("[data-hero-copy]", {
          yPercent: -18,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        // Cycle the role line, decoding each one like terminal output.
        const roles = profile.roles;
        let index = 0;
        const cycle = window.setInterval(() => {
          index = (index + 1) % roles.length;
          if (role.current) {
            animate(role.current, {
              innerHTML: scrambleText({ text: roles[index], chars: "a-z0-9_/<>", cursor: "▍" }),
              duration: 900,
            });
          }
        }, 3200);

        return () => {
          window.clearInterval(cycle);
          name.revert();
        };
      });
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      tabIndex={-1}
      aria-label="Introduction"
      className="relative isolate flex min-h-dvh flex-col justify-end overflow-hidden bg-dots"
    >
      <HeroScene />
      {/* Keeps the type legible where it overlaps the graph. */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_20%_85%,var(--ink)_20%,transparent_70%)]" />

      <div data-hero-copy className="relative px-4 pb-10 sm:px-8 lg:pl-40 lg:pr-16 lg:pb-14">
        <p data-hero-prompt className="mb-6 font-mono text-sm text-muted-foreground">
          <span className="hidden sm:inline">
            <span className="text-signal">gaurav</span>
            <span>@</span>
            <span className="text-packet">mesa</span>
            <span> ~ </span>
          </span>
          <span>$ </span>
          <span className="text-foreground">agent.run(&quot;who is gaurav?&quot;)</span>
          <span className="ml-0.5 inline-block animate-pulse text-signal">▍</span>
        </p>

        <h1 data-hero-name className="type-display text-[clamp(4.25rem,15vw,13.5rem)] text-foreground">
          <span className="block">Gaurav</span>
          <span className="block text-transparent [-webkit-text-stroke:1.5px_#ededed]">Madan</span>
        </h1>

        <div className="mt-8 max-w-136">
          <div>
            <p data-hero-reveal className="text-xl font-semibold sm:text-2xl">
              {profile.headline}
              <span ref={role} className="mt-1 block font-mono text-lg font-normal text-signal sm:text-xl">
                {profile.roles[0]}
              </span>
            </p>
            <p data-hero-reveal className="mt-4 max-w-[46ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              {profile.pitch}
            </p>
            <div data-hero-reveal className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="h-11 px-5 text-base" onClick={() => scrollTo("work")}>
                See the work
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-5 text-base"
                nativeButton={false}
                render={<a href={`mailto:${profile.email}`} />}
              >
                Email me
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
