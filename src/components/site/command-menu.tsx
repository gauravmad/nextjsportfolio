"use client";

import { useEffect } from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { toast } from "@/components/ui/toast";
import { profile, projects, sections } from "@/content/portfolio";
import { useScrollToSection } from "./smooth-scroll";

const SOURCE_URL = "https://github.com/gauravmad/nextjsportfolio";

/** ⌘K / Ctrl+K palette: jump anywhere, copy the email, open profiles. */
export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const scrollTo = useScrollToSection();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const run = (action: () => void) => {
    onOpenChange(false);
    // Let the dialog release scroll-lock before scrolling.
    window.setTimeout(action, 60);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast.add({ title: "Email copied", description: profile.email, type: "success" });
    } catch {
      toast.add({ title: "Couldn't copy the email", description: profile.email, type: "error" });
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Command palette" description="Jump to a section or run an action">
      {/* CommandDialog is only the dialog shell; <Command> owns the search state. */}
      <Command>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList className="font-mono">
        <CommandEmpty>No matching command.</CommandEmpty>
        <CommandGroup heading="Go to">
          {sections.map((section) => (
            <CommandItem key={section.id} value={`go ${section.label}`} onSelect={() => run(() => scrollTo(section.id))}>
              {section.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.slug}
              value={`project ${project.name} ${project.stack.join(" ")}`}
              onSelect={() => run(() => scrollTo(`project-${project.slug}`))}
            >
              {project.name}
              <CommandShortcut>{project.outcome.value}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem value="copy email" onSelect={() => run(copyEmail)}>
            Copy email address
          </CommandItem>
          <CommandItem value="open github" onSelect={() => run(() => window.open(profile.links.github, "_blank", "noopener"))}>
            Open GitHub
          </CommandItem>
          <CommandItem value="open linkedin" onSelect={() => run(() => window.open(profile.links.linkedin, "_blank", "noopener"))}>
            Open LinkedIn
          </CommandItem>
          <CommandItem value="view source code" onSelect={() => run(() => window.open(SOURCE_URL, "_blank", "noopener"))}>
            View this site&apos;s source
          </CommandItem>
        </CommandGroup>
      </CommandList>
      </Command>
    </CommandDialog>
  );
}
