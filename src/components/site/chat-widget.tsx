"use client";

import { ArrowUp, MessageSquare, RotateCcw, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { chatStarters, profile } from "@/content/portfolio";
import { CHAT_LIMITS, useChat } from "@/features/chat";
import { cn } from "@/lib/utils";

/** Fired by the command palette to open the chat from anywhere. */
export const OPEN_CHAT_EVENT = "portfolio:open-chat";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const { messages, status, error, send, stop, reset } = useChat();
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const streaming = status === "streaming";

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  // Keep the newest text in view while a reply streams in.
  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [messages]);

  const submit = (text: string) => {
    if (!text.trim() || streaming) return;
    void send(text);
    setDraft("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="chat-panel"
        className={cn(
          "fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full border border-rule bg-raised/90 py-2.5 pr-4 pl-3 text-sm font-medium shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur transition-all hover:border-foreground/30 sm:right-6 sm:bottom-6",
          open && "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <span className="relative grid size-7 place-items-center rounded-full bg-foreground text-ink">
          <MessageSquare className="size-3.5" />
          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-raised bg-ok" />
        </span>
        Ask me anything
      </button>

      <div
        id="chat-panel"
        role="dialog"
        aria-label="Ask me anything"
        aria-hidden={!open}
        inert={!open}
        onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
        className={cn(
          "fixed inset-x-2 bottom-2 z-50 flex h-[min(620px,calc(100dvh-1rem))] flex-col overflow-hidden rounded-2xl border border-rule bg-panel shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-300 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <header className="flex items-center gap-3 border-b border-rule px-4 py-3">
          <span className="grid size-9 place-items-center rounded-full bg-foreground font-semibold text-ink">G</span>
          <div className="min-w-0 flex-1">
            <p className="font-medium leading-tight">Ask me anything</p>
            <p className="truncate font-mono text-[11px] text-muted-foreground">answers from my portfolio · may be imperfect</p>
          </div>
          {messages.length ? (
            <Button variant="ghost" size="icon-sm" onClick={reset} aria-label="Start over">
              <RotateCcw />
            </Button>
          ) : null}
          <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)} aria-label="Close chat">
            <X />
          </Button>
        </header>

        <div ref={log} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
          <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-raised px-3.5 py-2.5 text-[15px] leading-relaxed">
            Hi, I&apos;m Gaurav&apos;s assistant. Ask about his projects, the agents he builds, or whether he can help with yours.
          </p>

          {messages.map((message, index) => (
            <p
              key={index}
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap",
                message.role === "user" ? "ml-auto rounded-tr-sm bg-foreground text-ink" : "rounded-tl-sm bg-raised",
              )}
            >
              {message.content || <span className="inline-flex gap-1 py-1" aria-label="Thinking"><Dot /><Dot delay="150ms" /><Dot delay="300ms" /></span>}
            </p>
          ))}

          {error ? (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {messages.length === 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {chatStarters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => submit(starter)}
                  className="rounded-full border border-rule px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  {starter}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(draft);
          }}
          className="border-t border-rule p-3"
        >
          <div className="flex items-end gap-2 rounded-xl border border-rule bg-ink px-3 py-2 focus-within:border-foreground/30">
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
              className="max-h-32 min-h-6 flex-1 resize-none bg-transparent py-1 text-[15px] outline-none [field-sizing:content] placeholder:text-muted-foreground/60"
            />
            {streaming ? (
              <Button type="button" size="icon-sm" variant="secondary" onClick={stop} aria-label="Stop answering">
                <Square className="fill-current" />
              </Button>
            ) : (
              <Button type="submit" size="icon-sm" disabled={!draft.trim()} aria-label="Send question">
                <ArrowUp />
              </Button>
            )}
          </div>
          <p className="mt-2 px-1 text-[11px] text-muted-foreground/70">
            For anything serious, email{" "}
            <a href={`mailto:${profile.email}`} className="underline underline-offset-2 hover:text-foreground">
              {profile.email}
            </a>
          </p>
        </form>
      </div>
    </>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: delay }} />;
}
