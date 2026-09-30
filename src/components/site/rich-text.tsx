/**
 * Renders the assistant's plain-text replies with light formatting:
 * paragraphs, bullet and numbered lists, **bold**, `code`, links and emails.
 * Builds React nodes only (never raw HTML), so model output can't inject markup.
 */
import { Fragment, type ReactNode } from "react";

const INLINE = /(\*\*[^*\n]+\*\*|`[^`\n]+`|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/;
const EMAIL = /^[\w.+-]+@[\w-]+(?:\.[\w-]+)+/;
const BULLET = /^\s*(?:[-*•]|\d+[.)])\s+/;
const TRAILING_PUNCTUATION = /[.,;:!?]+$/;

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="rounded bg-ink/70 px-1 py-0.5 font-mono text-[0.85em] text-syntax-string">
          {part.slice(1, -1)}
        </code>
      );
    }
    const isUrl = /^https?:\/\//.test(part);
    if (isUrl || EMAIL.test(part)) {
      const target = part.replace(TRAILING_PUNCTUATION, "");
      return (
        <Fragment key={i}>
          <a
            href={isUrl ? target : `mailto:${target}`}
            target={isUrl ? "_blank" : undefined}
            rel="noreferrer"
            className="text-syntax-key underline decoration-syntax-key/40 underline-offset-2 hover:decoration-syntax-key"
          >
            {isUrl ? target.replace(/^https?:\/\//, "") : target}
          </a>
          {part.slice(target.length)}
        </Fragment>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

type Block = { kind: "p"; lines: string[] } | { kind: "list"; ordered: boolean; items: string[] };

/** Groups lines into paragraphs and lists; a lead-in line straight before bullets stays a paragraph. */
function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.trim().split("\n")) {
    const line = raw.trimEnd();
    const last = blocks.at(-1);
    if (!line.trim()) {
      blocks.push({ kind: "p", lines: [] });
      continue;
    }
    if (BULLET.test(line)) {
      const item = line.replace(BULLET, "");
      if (last?.kind === "list") last.items.push(item);
      else blocks.push({ kind: "list", ordered: /^\s*\d/.test(line), items: [item] });
      continue;
    }
    if (last?.kind === "p") last.lines.push(line);
    else blocks.push({ kind: "p", lines: [line] });
  }
  return blocks.filter((block) => (block.kind === "p" ? block.lines.length > 0 : true));
}

export function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-2.5">
      {toBlocks(text).map((block, b) => {
        if (block.kind === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List key={b} className="space-y-1.5">
              {block.items.map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden className="mt-[0.15em] shrink-0 font-mono text-xs text-signal">
                    {block.ordered ? `${i + 1}.` : "▸"}
                  </span>
                  <span>{inline(item)}</span>
                </li>
              ))}
            </List>
          );
        }
        return (
          <p key={b}>
            {block.lines.map((line, l) => (
              <Fragment key={l}>
                {l > 0 ? <br /> : null}
                {inline(line)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
