"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, useSyncExternalStore } from "react";

import { gsap, MOTION, ScrollTrigger } from "@/lib/motion/gsap";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(MOTION.reduced);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one clock. Skipped entirely for reduced-motion users.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOTION.reduced).matches,
    () => false,
  );

  useEffect(() => {
    if (reduced) return;
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);
    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
    };
  }, [reduced]);

  // Web fonts change line breaks, so re-measure every trigger once they land.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}

/** Returns a function that scrolls to a section id, through Lenis when it's running. */
export function useScrollToSection() {
  const lenis = useLenis();
  return (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ block: "start" });
    // Move focus with the view so keyboard users land in the section.
    target.focus({ preventScroll: true });
  };
}
