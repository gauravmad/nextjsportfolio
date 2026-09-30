"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Heart, Mail } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { profile } from "@/content/portfolio";
import { contactSchema, useSendContact, type ContactFormValues, type ContactInput } from "@/features/contact";
import { isApiError, toErrorMessage } from "@/lib/api/http-error";
import { cn } from "@/lib/utils";

const FIELDS = ["name", "email", "message"] as const;

function Prompt({ label }: { label: string }) {
  return (
    <span aria-hidden className="shrink-0 select-none text-muted-foreground">
      <span className="text-signal">?</span> {label}
      <span className="text-rule"> ›</span>
    </span>
  );
}

function ContactForm() {
  const send = useSendContact();
  const form = useForm<ContactFormValues, unknown, ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    send.mutate(values, {
      onSuccess: () => {
        form.reset();
        toast.add({ title: "Message sent", description: "I'll reply within a couple of days.", type: "success" });
      },
      onError: (error) => {
        if (isApiError(error) && error.isValidation) {
          for (const field of FIELDS) {
            const message = error.fieldErrors[field]?.[0];
            if (message) form.setError(field, { message });
          }
          return;
        }
        form.setError("root", { message: toErrorMessage(error) });
      },
    }),
  );

  const inputClass =
    "w-full min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none";

  return (
    <form onSubmit={onSubmit} noValidate className="overflow-hidden rounded-xl border border-rule bg-panel">
      <div className="flex items-center gap-2 border-b border-rule bg-[linear-gradient(90deg,#1f2937,#111827)] px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">gaurav@mesa: ~/contact</span>
      </div>

      <div className="space-y-5 p-5 font-mono text-sm sm:p-7">
        <p className="text-muted-foreground">
          <span className="text-signal">$</span> npx hire-gaurav --interactive
        </p>

        <div>
          <label className="flex gap-3">
            <Prompt label="name" />
            <span className="sr-only">Your name</span>
            <input {...form.register("name")} autoComplete="name" placeholder="Ada Lovelace" aria-invalid={!!errors.name} className={inputClass} />
          </label>
          {errors.name ? <p role="alert" className="mt-1.5 text-destructive">✗ {errors.name.message}</p> : null}
        </div>

        <div>
          <label className="flex gap-3">
            <Prompt label="email" />
            <span className="sr-only">Your email</span>
            <input {...form.register("email")} type="email" autoComplete="email" placeholder="ada@startup.com" aria-invalid={!!errors.email} className={inputClass} />
          </label>
          {errors.email ? <p role="alert" className="mt-1.5 text-destructive">✗ {errors.email.message}</p> : null}
        </div>

        <div>
          <label className="flex flex-col gap-2">
            <Prompt label="what are you building?" />
            <span className="sr-only">Your message</span>
            <textarea
              {...form.register("message")}
              rows={5}
              placeholder="An MVP for… / an AI feature that… / a system to replace…"
              aria-invalid={!!errors.message}
              className={cn(inputClass, "resize-none rounded-md border border-rule p-3 focus-visible:border-signal")}
            />
          </label>
          {errors.message ? <p role="alert" className="mt-1.5 text-destructive">✗ {errors.message.message}</p> : null}
        </div>

        {/* Honeypot: invisible to people and to assistive tech; bots fill it in. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input {...form.register("website")} tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {errors.root ? <p role="alert" className="text-destructive">✗ {errors.root.message}</p> : null}
        {send.isSuccess ? (
          <p role="status" className="text-[#4ade80]">✓ 202 Accepted. Your message is in my inbox.</p>
        ) : null}

        <Button type="submit" size="lg" disabled={send.isPending} className="h-11 px-5 font-sans text-base">
          {send.isPending ? <Spinner /> : null}
          {send.isPending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-title"
      className="px-4 pt-28 pb-10 sm:px-8 lg:pl-40 lg:pr-16"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-20">
        <div>
          <h2 id="contact-title" className="type-display text-[clamp(3.75rem,11vw,10rem)]">
            Let&apos;s ship
            <br />
            <span className="text-muted-foreground">yours.</span>
          </h2>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-muted-foreground">
            Founders and teams: bring the idea, the spreadsheet you&apos;ve outgrown, or the AI feature that needs to work on real data. I&apos;ll tell you what&apos;s worth building first.
          </p>
          <ul className="mt-8 flex gap-3" aria-label="Elsewhere">
            {[
              { href: `mailto:${profile.email}`, label: `Email ${profile.email}`, icon: <Mail className="size-5" /> },
              { href: profile.links.linkedin, label: "LinkedIn", icon: <LinkedinIcon className="size-5" /> },
              { href: profile.links.github, label: "GitHub", icon: <GithubIcon className="size-5" /> },
            ].map((link) => (
              <li key={link.label}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <a
                        href={link.href}
                        target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noreferrer"
                        aria-label={link.label}
                        className="grid size-12 place-items-center rounded-xl border border-rule text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                      />
                    }
                  >
                    {link.icon}
                  </TooltipTrigger>
                  <TooltipContent>{link.label}</TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </div>

      <footer className="mt-28 flex flex-col gap-3 border-t border-rule pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Designed & built with <Heart aria-label="love" className="inline size-3.5 fill-signal text-signal" /> by{" "}
          <span className="text-foreground">{profile.name}</span>
        </p>
        <p className="font-mono text-xs">
          <span className="text-signal">git commit</span> -m &quot;thanks for scrolling&quot;
        </p>
      </footer>
    </section>
  );
}
