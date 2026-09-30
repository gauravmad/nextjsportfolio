"use client";

import { animate, createSpring } from "animejs";
import { ArrowUp, RotateCcw, Sparkles, Square, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatStarters, profile } from "@/content/portfolio";
import { CHAT_LIMITS, useChat } from "@/features/chat";
import { MOTION } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";
import { ThinkingIndicator, TypedReply } from "./chat-typing";

/** Fired by the command palette to open the chat from anywhere. */
export const OPEN_CHAT_EVENT = "portfolio:open-chat";

const POP = createSpring({ stiffness: 320, damping: 24 });

function reducedMotion() {
  return window.matchMedia(MOTION.reduced).matches;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const { messages, status, error, send, stop, reset } = useChat();
  const panel = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const streaming = status === "streaming";

  const show = useCallback(() => {
    if (!panel.current || !launcher.current) return;
    setOpen(true);
    const instant = reducedMotion();
    // The launcher ducks out as the panel grows from its corner.
    animate(launcher.current, { scale: [1, 0.6], opacity: [1, 0], duration: instant ? 0 : 160, ease: "inQuad" });
    animate(panel.current, {
      opacity: [0, 1],
      scale: [0.5, 1],
      translateY: [32, 0],
      filter: ["blur(10px)", "blur(0px)"],
      ...(instant ? { duration: 0 } : { ease: POP }),
      onComplete: () => input.current?.focus(),
    });
  }, []);

  const hide = useCallback(() => {
    if (!panel.current || !launcher.current) return;
    const instant = reducedMotion();
    animate(panel.current, {
      opacity: 0,
      scale: 0.55,
      translateY: 28,
      filter: "blur(8px)",
      duration: instant ? 0 : 220,
      ease: "inCubic",
      onComplete: () => {
        setOpen(false);
        // …and the launcher springs back in with a small overshoot.
        animate(launcher.current!, { scale: [0.6, 1], opacity: [0, 1], ...(instant ? { duration: 0 } : { ease: POP }) });
        launcher.current?.focus();
      },
    });
  }, []);

  useEffect(() => {
    window.addEventListener(OPEN_CHAT_EVENT, show);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, show);
  }, [show]);

  // Keep the newest text in view while a reply streams in.
  // Keep the newest text in view while a reply types out. The ScrollArea's
  // viewport isn't exposed, so it's found through the root.
  useEffect(() => {
    const viewport = log.current?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]');
    if (!viewport) return;
    const follow = () => viewport.scrollTo({ top: viewport.scrollHeight });
    follow();
    // Typing grows the content between renders, so follow size changes too.
    const observer = new ResizeObserver(follow);
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);
    return () => observer.disconnect();
  }, [messages.length, open]);

  const submit = (text: string) => {
    if (!text.trim() || streaming) return;
    void send(text);
    setDraft("");
  };

  const last = messages.at(-1);

  return (
    <>
      <button
        ref={launcher}
        type="button"
        onClick={show}
        aria-expanded={open}
        aria-controls="chat-panel"
        className={cn(
          "chat-launcher group fixed right-4 bottom-4 z-50 flex items-center gap-2.5 rounded-full bg-raised py-2 pr-4 pl-2 text-sm font-medium shadow-[0_10px_40px_-8px_rgba(249,115,22,0.35)] transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-6px_rgba(249,115,22,0.5)] active:translate-y-0 sm:right-6 sm:bottom-6",
          open && "pointer-events-none",
        )}
      >
        <span className="relative grid size-8 place-items-center rounded-full bg-foreground text-ink transition-transform duration-500 group-hover:rotate-[360deg]">
          <Sparkles className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-raised bg-ok">
            <span className="absolute inset-0 animate-ping rounded-full bg-ok/70" />
          </span>
        </span>
        <span>Ask me anything</span>
      </button>

      <div
        ref={panel}
        id="chat-panel"
        role="dialog"
        aria-label="Ask me anything"
        aria-hidden={!open}
        inert={!open}
        onKeyDown={(event) => event.key === "Escape" && hide()}
        style={{ opacity: 0 }}
        className={cn(
          "fixed inset-x-2 bottom-2 z-50 flex h-[min(640px,calc(100dvh-1rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-rule bg-panel/95 shadow-[0_30px_80px_-10px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px]",
          !open && "pointer-events-none",
        )}
      >
        {/* A thin signal line along the top edge, so the panel reads as "live". */}
        <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-signal to-transparent opacity-70" />

        <header className="flex items-center gap-3 px-4 py-3.5">
          <span className="relative grid size-10 place-items-center rounded-full bg-foreground text-ink">
            <Sparkles className="size-[18px]" />
            <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-panel bg-ok" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-tight">Ask me anything</p>
            <p className="font-mono text-[11px] text-muted-foreground">
              <span className="text-ok">online</span> · answers from my portfolio
            </p>
          </div>
          {messages.length ? (
            <Button variant="ghost" size="icon-sm" onClick={reset} aria-label="Start over" className="rounded-full">
              <RotateCcw />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={hide}
            aria-label="Close chat"
            className="rounded-full transition-transform duration-300 hover:rotate-90"
          >
            <X />
          </Button>
        </header>

        <ScrollArea ref={log} data-lenis-prevent className="min-h-0 flex-1 border-t border-rule">
        <div className="space-y-3 px-4 py-4" aria-live="polite">
          <div className="chat-bubble-in max-w-[88%] rounded-2xl rounded-tl-md bg-raised px-4 py-3 text-[14.5px] leading-relaxed">
            Hi, I&apos;m Gaurav&apos;s assistant. Ask about his projects, the agents he builds, or whether he can help with yours.
          </div>

          {messages.map((message, index) =>
            message.role === "user" ? (
              <div
                key={index}
                className="chat-bubble-in ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-foreground px-4 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-wrap text-ink"
              >
                {message.content}
              </div>
            ) : (
              <div key={index} className="chat-bubble-in w-fit min-w-[min(100%,15rem)] max-w-[92%] rounded-2xl rounded-tl-md bg-raised px-4 py-3 text-[14.5px] leading-relaxed">
                {message.content ? (
                  <TypedReply text={message.content} animate={message === last} streaming={streaming && message === last} />
                ) : (
                  <ThinkingIndicator />
                )}
              </div>
            ),
          )}

          {error ? (
            <p role="alert" className="chat-bubble-in rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {messages.length === 0 ? (
            <div className="grid gap-2 pt-2">
              {chatStarters.map((starter, i) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => submit(starter)}
                  style={{ animationDelay: `${120 + i * 60}ms` }}
                  className="chat-bubble-in group/starter flex items-center justify-between rounded-xl border border-rule px-3.5 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-foreground/25 hover:bg-raised hover:text-foreground"
                >
                  {starter}
                  <ArrowUp className="size-3.5 rotate-45 opacity-0 transition-all group-hover/starter:rotate-90 group-hover/starter:opacity-100" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        </ScrollArea>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(draft);
          }}
          className="border-t border-rule p-3"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-rule bg-ink px-3.5 py-2.5 transition-colors focus-within:border-signal/50">
            <label htmlFor="chat-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="chat-input"
              ref={input}
              rows={1}
              value={draft}
              maxLength={CHAT_LIMITS.messageChars}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit(draft);
                }
              }}
              placeholder="Ask about Nexus, agents, stacks…"
              className="max-h-32 min-h-6 flex-1 resize-none bg-transparent py-1 text-[15px] outline-none field-sizing-content placeholder:text-muted-foreground/60"
            />
            {streaming ? (
              <Button type="button" size="icon-sm" variant="secondary" onClick={stop} aria-label="Stop answering" className="rounded-full">
                <Square className="size-3 fill-current" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon-sm"
                disabled={!draft.trim()}
                aria-label="Send question"
                className="rounded-full bg-signal text-ink transition-transform hover:bg-signal/85 enabled:hover:-translate-y-0.5 disabled:bg-muted disabled:text-muted-foreground"
              >
                <ArrowUp />
              </Button>
            )}
          </div>
          <p className="mt-2 px-1 text-[11px] text-muted-foreground/70">
            Enter to send · for anything serious, email{" "}
            <a href={`mailto:${profile.email}`} className="underline underline-offset-2 hover:text-foreground">
              {profile.email}
            </a>
          </p>
        </form>
      </div>
    </>
  );
}

