"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { MOTION } from "@/lib/motion/gsap";
import { sceneState } from "./scene-state";

// WebGL never renders on the server, and three.js stays out of the first-load bundle.
const PipelineScene = dynamic(() => import("./pipeline-scene"), { ssr: false });

export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const reducedMotion = useMediaQuery(MOTION.reduced);
  const compact = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry!.isIntersecting));
    observer.observe(el);

    const onPointer = (event: PointerEvent) => {
      sceneState.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 opacity-45 md:opacity-100" aria-hidden>
      <PipelineScene active={visible} reducedMotion={reducedMotion} compact={compact} />
    </div>
  );
}
