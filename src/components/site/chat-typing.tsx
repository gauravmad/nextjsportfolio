"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { RichText } from "./rich-text";

const STEPS = ["Reading your question", "Searching the portfolio", "Checking project notes", "Writing the answer"];

/** Shown before the first token arrives: an agent-style trace of what's happening. */
export function ThinkingIndicator() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, STEPS.length - 1)), 1100);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2.5 py-0.5" role="status" aria-label="Thinking">
      <Sparkles aria-hidden className="size-4 shrink-0 animate-spin text-signal [animation-duration:2.4s]" />
      <span key={step} className="chat-shimmer chat-bubble-in text-sm">
        {STEPS[step]}…
      </span>
      <span aria-hidden className="ml-auto font-mono text-[10px] text-muted-foreground/60">
        {step + 1}/{STEPS.length}
      </span>
    </div>
  );
}

/**
 * Types the reply out character by character. Streamed chunks arrive in bursts;
 * this reveals them at an even pace, speeding up when it falls behind.
 */
export function TypedReply({ text, animate, streaming }: {
  text: string;
  /** Type this reply out (only the newest one; older replies render in full). */
  animate: boolean;
  /** More text is still arriving. */
  streaming: boolean;
}) {
  const [shown, setShown] = useState(animate ? 0 : text.length);
  // Mirrors `shown` so the frame loop can decide when to stop without waiting on a render.
  const progress = useRef(shown);

  useEffect(() => {
    if (!animate) return;
    let frame = 0;
    const tick = () => {
      const behind = text.length - progress.current;
      if (behind <= 0) return;
      progress.current += Math.max(1, Math.ceil(behind / 10));
      setShown(progress.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, animate]);

  const visible = animate ? text.slice(0, shown) : text;
  const typing = animate && (shown < text.length || streaming);

  return (
    <div>
      <RichText text={visible} />
      {typing ? <span aria-hidden className="chat-caret" /> : null}
    </div>
  );
}
