"use client";

import {
  Bot,
  Database,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { workflows, type FlowNode, type NodeKind, type Workflow } from "@/content/portfolio";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";

const CANVAS = { width: 1180, height: 460 };

const KIND: Record<NodeKind, { icon: LucideIcon; ms: number }> = {
  trigger: { icon: Zap, ms: 4 },
  agent: { icon: Bot, ms: 840 },
  model: { icon: Sparkles, ms: 0 },
  memory: { icon: Database, ms: 60 },
  tool: { icon: Wrench, ms: 260 },
  guard: { icon: ShieldCheck, ms: 18 },
  human: { icon: UserCheck, ms: 1200 },
  output: { icon: Send, ms: 90 },
};

/** Model and memory nodes are n8n "sub-nodes": circles hanging under an agent. */
const isSub = (node: FlowNode) => node.kind === "model" || node.kind === "memory";

function size(node: FlowNode) {
  if (isSub(node)) return { w: 64, h: 64 };
  if (node.kind === "agent") return { w: 168, h: 80 };
  return { w: 80, h: 80 };
}

function edgePath(from: FlowNode, to: FlowNode) {
  const a = size(from);
  const b = size(to);
  if (isSub(to)) {
    // AI sub-connection: from the agent's bottom edge down to the circle.
    const x1 = from.x + a.w / 2 + (to.x + b.w / 2 < from.x + a.w / 2 ? -28 : to.x + b.w / 2 > from.x + a.w / 2 ? 28 : 0);
    const y1 = from.y + a.h;
    const x2 = to.x + b.w / 2;
    const y2 = to.y;
    return `M${x1},${y1} C${x1},${y1 + 50} ${x2},${y2 - 50} ${x2},${y2}`;
  }
  const x1 = from.x + a.w;
  const y1 = from.y + a.h / 2;
  const x2 = to.x;
  const y2 = to.y + b.h / 2;
  const dx = Math.max(40, (x2 - x1) / 2);
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}

interface LogLine {
  id: string;
  label: string;
  output: string;
  ms: number;
}

function Canvas({ workflow }: { workflow: Workflow }) {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [scale, setScale] = useState(1);
  const [log, setLog] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const byId = Object.fromEntries(workflow.nodes.map((n) => [n.id, n]));

  // Fit the 1180px board to the viewport, but never below 60% (then it pans).
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.max(0.6, Math.min(1, (entry!.contentRect.width - 32) / CANVAS.width)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Drag the board to pan with a mouse, like the n8n editor. Touch and
  // trackpads already scroll the viewport natively.
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !viewport.current) return;
    drag.current = { x: event.clientX, y: event.clientY, left: viewport.current.scrollLeft, top: viewport.current.scrollTop };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !viewport.current) return;
    viewport.current.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
    viewport.current.scrollTop = drag.current.top - (event.clientY - drag.current.y);
  };
  const onPointerUp = () => (drag.current = null);

  const reset = () => {
    timeline.current?.kill();
    const el = root.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>("[data-node]").forEach((node) => (node.dataset.state = "idle"));
    el.querySelectorAll<SVGPathElement>("[data-edge]").forEach((edge) => (edge.dataset.state = "idle"));
    setLog([]);
    setRunning(false);
  };

  const execute = () => {
    reset();
    const el = root.current!;
    const reduced = window.matchMedia(MOTION.reduced).matches;
    const tl = gsap.timeline({ onComplete: () => setRunning(false) });
    timeline.current = tl;
    setRunning(true);

    workflow.run.forEach((id) => {
      const node = el.querySelector<HTMLElement>(`[data-node="${id}"]`);
      const flow = byId[id]!;
      const outgoing = el.querySelectorAll<SVGPathElement>(`[data-edge^="${id}->"]`);
      // Sub-nodes an agent calls light up while the agent runs.
      const subs = workflow.edges.filter(([from, to]) => from === id && isSub(byId[to]!)).map(([, to]) => to);
      const step = reduced ? 0 : Math.min(0.9, 0.25 + KIND[flow.kind].ms / 2000);

      tl.call(() => {
        if (node) node.dataset.state = "running";
        subs.forEach((sub) => {
          const subEl = el.querySelector<HTMLElement>(`[data-node="${sub}"]`);
          if (subEl) subEl.dataset.state = "running";
        });
      });
      tl.to({}, { duration: step });
      tl.call(() => {
        if (node) node.dataset.state = "done";
        subs.forEach((sub) => {
          const subEl = el.querySelector<HTMLElement>(`[data-node="${sub}"]`);
          if (subEl) subEl.dataset.state = "done";
        });
        outgoing.forEach((edge) => (edge.dataset.state = "done"));
        setLog((lines) => [...lines, { id, label: flow.label, output: flow.output, ms: KIND[flow.kind].ms }]);
      });
    });
  };

  // Run once by itself the first time the canvas scrolls into view.
  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: root.current, start: "top 65%", once: true, onEnter: () => execute() });
      return () => timeline.current?.kill();
    },
    { scope: root, dependencies: [workflow.slug] },
  );

  const total = log.reduce((sum, line) => sum + line.ms, 0);

  return (
    <div ref={root} className="overflow-hidden rounded-2xl border border-rule bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-medium">{workflow.name}</span>
          <span className="rounded-full border border-rule px-2 py-0.5 font-mono text-[11px] text-muted-foreground">{workflow.project}</span>
          <span className="hidden items-center gap-1.5 font-mono text-[11px] text-ok sm:flex">
            <span className="size-1.5 rounded-full bg-ok" /> Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={reset} aria-label="Reset run">
            <RotateCcw />
          </Button>
          <Button size="sm" onClick={execute} disabled={running} className="bg-signal text-ink hover:bg-signal/85">
            <Play className="fill-current" />
            {running ? "Running…" : "Execute workflow"}
          </Button>
        </div>
      </div>

      <div
        ref={viewport}
        data-lenis-prevent
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="bg-dots relative h-85 cursor-grab overflow-auto overscroll-contain select-none active:cursor-grabbing sm:h-105 lg:h-125"
        role="img"
        aria-label={`${workflow.name} workflow: ${workflow.run.map((id) => byId[id]!.label).join(", then ")}.`}
      >
        <div className="p-4" style={{ width: CANVAS.width * scale + 32, height: CANVAS.height * scale + 32 }}>
          <div className="relative origin-top-left" style={{ width: CANVAS.width, height: CANVAS.height, transform: `scale(${scale})` }}>
            <svg className="absolute inset-0 overflow-visible" width={CANVAS.width} height={CANVAS.height} aria-hidden>
              {workflow.edges.map(([from, to]) => {
                const sub = isSub(byId[to]!);
                return (
                  <path
                    key={`${from}->${to}`}
                    data-edge={`${from}->${to}`}
                    data-state="idle"
                    d={edgePath(byId[from]!, byId[to]!)}
                    fill="none"
                    strokeWidth={sub ? 1.5 : 2}
                    strokeDasharray={sub ? "5 5" : undefined}
                    className="stroke-[#3a3a3a] transition-[stroke] duration-500 data-[state=done]:stroke-ok/70"
                  />
                );
              })}
            </svg>

            {workflow.nodes.map((node) => {
              const { w, h } = size(node);
              const Icon = KIND[node.kind].icon;
              const sub = isSub(node);
              return (
                <div
                  key={node.id}
                  data-node={node.id}
                  data-state="idle"
                  className="group/node absolute"
                  style={{ left: node.x, top: node.y, width: w }}
                >
                  <div
                    className={cn(
                      "relative grid place-items-center border-2 border-[#3a3a3a] bg-raised transition-[border-color,box-shadow] duration-300",
                      "group-data-[state=running]/node:border-signal group-data-[state=running]/node:shadow-[0_0_24px_-4px_var(--signal)]",
                      "group-data-[state=done]/node:border-ok/80",
                      sub ? "rounded-full" : node.kind === "trigger" ? "rounded-l-[2rem] rounded-r-xl" : "rounded-xl",
                    )}
                    style={{ height: h }}
                  >
                    <Icon className={cn("text-muted-foreground", sub ? "size-6" : "size-8", node.kind === "agent" && "text-foreground")} />
                    <span className="absolute -top-2.5 -right-2.5 hidden size-5 place-items-center rounded-full bg-ok text-[11px] font-bold text-ink group-data-[state=done]/node:grid">
                      ✓
                    </span>
                    <span className="absolute -top-2.5 -right-2.5 hidden size-5 animate-spin rounded-full border-2 border-signal border-t-transparent group-data-[state=running]/node:block" />
                  </div>
                  <p className="mt-2 text-center text-[13px] font-medium leading-tight">{node.label}</p>
                  <p className="text-center font-mono text-[10px] text-muted-foreground">{node.type}</p>
                  {node.output ? (
                    <p className="mx-auto mt-1 hidden w-fit rounded bg-ok/10 px-1.5 py-0.5 font-mono text-[10px] text-ok group-data-[state=done]/node:block">
                      {node.output}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="border-t border-rule px-4 py-1.5 text-right font-mono text-[11px] text-muted-foreground/70">drag to pan</p>

      <div className="border-t border-rule bg-ink/60 px-4 py-3 font-mono text-xs" aria-live="polite">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Execution log (sample run, illustrative values)</span>
          {log.length === workflow.run.length ? (
            <span className="text-ok">Succeeded in {(total / 1000).toFixed(2)}s</span>
          ) : null}
        </div>
        <ol className="mt-2 grid max-h-28 gap-0.5 overflow-y-auto sm:grid-cols-2">
          {log.map((line) => (
            <li key={line.id} className="truncate">
              <span className="text-ok">✓</span> <span className="text-foreground">{line.label}</span>
              {line.output ? <span className="text-muted-foreground"> → {line.output}</span> : null}
              <span className="text-muted-foreground/60"> {line.ms}ms</span>
            </li>
          ))}
          {log.length === 0 ? <li className="text-muted-foreground/60">Waiting for a run…</li> : null}
        </ol>
      </div>
    </div>
  );
}

export function Workflows() {
  const [active, setActive] = useState(workflows[0]!.slug);
  const workflow = workflows.find((w) => w.slug === active)!;

  return (
    <section
      id="workflows"
      tabIndex={-1}
      aria-labelledby="workflows-title"
      className="px-4 py-28 sm:px-8 lg:pl-40 lg:pr-16"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-end">
        <h2 id="workflows-title" className="type-title text-[clamp(2.75rem,6vw,5.5rem)]">
          Agent workflows
        </h2>
        <p className="text-lg text-muted-foreground">
          The pipelines behind the products, laid out the way you&apos;d see them in n8n. Run one to watch the agents hand off work.
        </p>
      </div>

      <div role="tablist" aria-label="Workflows" className="mt-10 mb-4 flex flex-wrap gap-2">
        {workflows.map((w) => (
          <button
            key={w.slug}
            role="tab"
            type="button"
            aria-selected={w.slug === active}
            onClick={() => setActive(w.slug)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm transition-colors",
              w.slug === active
                ? "border-foreground/30 bg-raised text-foreground"
                : "border-rule text-muted-foreground hover:text-foreground",
            )}
          >
            {w.name}
          </button>
        ))}
      </div>
      <p className="mb-4 max-w-[70ch] text-muted-foreground">{workflow.description}</p>

      {/* Keyed so each workflow gets a fresh canvas, draggable and run state. */}
      <Canvas key={workflow.slug} workflow={workflow} />
    </section>
  );
}
