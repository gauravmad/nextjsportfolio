/**
 * Every word on the portfolio lives here, so copy edits never touch components.
 * The chat assistant's system prompt is built from this file too, so it can
 * only ever say what's written here.
 *
 * Source of truth: resume (Oct 2026), LinkedIn headline, GitHub (verified via API).
 */

export const profile = {
  name: "Gaurav Madan",
  headline: "AI & Tech Builder @ Mesa",
  roles: ["Startup builder", "Forward deployed engineer", "Founding engineer"],
  pitch:
    "I help founders launch MVPs, AI tools and systems that scale. I take products from a one-line idea to production, and stay close enough to the business to know which parts are worth building.",
  location: "Bengaluru, India",
  email: "gauravmadan2004@gmail.com",
  links: {
    github: "https://github.com/gauravmad",
    linkedin: "https://www.linkedin.com/in/gauravdev04/",
  },
} as const;

/** Lit word by word on scroll. Keep it one paragraph. */
export const manifesto =
  "Most founders don't need more code. They need the right system, shipped this week, costing what it should. I build agents that answer from real data, platforms that replace spreadsheets and aging vendors, and the guardrails that keep both safe and cheap in production.";

export interface Outcome {
  /** What the outcome is about, in words, before any number. */
  what: string;
  before?: string;
  after: string;
  how: string;
}

export const outcomes: Outcome[] = [
  {
    what: "Ed-tech startup's monthly revenue",
    before: "₹7–8L",
    after: "₹45–50L",
    how: "Set up its tech from scratch and automated operations end to end, so the founders could focus on sales.",
  },
  {
    what: "Ad-tech startup's pre-seed round",
    after: "₹40L raised",
    how: "Built the product end to end as its founding engineer; it's now scaling.",
  },
  {
    what: "Cost of replacing Moodle",
    after: "₹40–50L saved",
    how: "Built Nexus, Mesa's own LMS, instead of licensing a vendor platform. 1,000+ users across three cohorts.",
  },
  {
    what: "LLM spend on creator discovery",
    after: "~45× cheaper",
    how: "Only ~9% of comments ever reach an LLM; cheap models filter first, frontier models score the shortlist.",
  },
  {
    what: "B-school ops turnaround",
    before: "weeks",
    after: "minutes",
    how: "A careers CRM, procure-to-pay finance and scheduled Sheets sync replaced Excel-driven processes.",
  },
];

/** Engineering throughput, verified from the GitHub API (Oct 2026). */
export const gitStats: { value: string; label: string }[] = [
  { value: "2,130", label: "commits to Mesa's org" },
  { value: "39 / 52", label: "Mesa repos shipped to" },
  { value: "6,018", label: "commits on GitHub, all time" },
  { value: "3+ yrs", label: "TypeScript, Python, Next.js" },
];

export interface Project {
  slug: string;
  name: string;
  kind: string;
  summary: string;
  detail: string;
  /** Hard engineering facts. */
  specs: string[];
  stack: string[];
  image: { src: string; alt: string; width: number; height: number };
  /** Public production host; verified to return 200. */
  host: string;
}

export const projects: Project[] = [
  {
    slug: "nexus",
    name: "Nexus",
    kind: "Mesa's LMS, with an AI agent built in",
    summary:
      "Replaced Moodle for the whole business school. I built it from scratch as the only engineer, and it runs every live cohort.",
    detail:
      "Five role-based portals (admin, student, professor, mentor, parent) over 39 API modules. Nexus AI, the agent inside it, routes each question across 10 intent types to text-to-SQL, RAG over documents, or both. Model-written SQL is statically guarded, auto-repaired and run under a read-only Postgres role.",
    specs: [
      "39 API modules, 56 frontend features",
      "Nexus AI: 10 intent types, guarded text-to-SQL",
      "Read-only Postgres role, pgvector memory",
      "655 commits, sole engineer",
    ],
    stack: ["Next.js 16", "Express 5", "Kysely", "PostgreSQL", "LangChain", "pgvector", "App Engine"],
    image: { src: "/work/nexus.webp", alt: "Nexus student dashboard: class schedule, attendance and community feed", width: 1470, height: 650 },
    host: "students.mesaschool.co.in",
  },
  {
    slug: "founders-compass",
    name: "Founder's Compass",
    kind: "AI startup mentor",
    summary: "Takes a founder from a raw idea to a verdict scored out of 100, then plans the first sprint.",
    detail:
      "Eight validation stages driven by a two-model loop: Gemini Pro mentors while Gemini Flash extracts structured data and writes search queries, grounded in live Google Search and RAG memory. Launch Pad's Business → Product → Tech agents turn the idea into a 7–10 day sprint plan.",
    specs: ["8 validation stages", "Two-model agent loop (Pro + Flash)", "Live Google Search grounding", "Qdrant RAG memory"],
    stack: ["FastAPI", "Gemini (Vertex AI)", "LangGraph", "Qdrant", "MongoDB", "Redis", "Next.js"],
    image: { src: "/work/founders-compass.webp", alt: "Founder's Compass: an idea moving through validation stages with a score of 72 out of 100", width: 1600, height: 843 },
    host: "compass-msl.mesaschool.co.in",
  },
  {
    slug: "influencer-intelligence",
    name: "Influencer Intelligence",
    kind: "Creator discovery for D2C brands",
    summary: "Turns a one-line campaign brief into a ranked shortlist of creators, showing every step of its reasoning.",
    detail:
      "A 13-stage pipeline with a human approval gate. Cheap discovery runs first (Serper, Apify, Gemini Flash); GPT scores only the brand's shortlist. Purchase intent in Hinglish and English is scored through pgvector.",
    specs: ["13-stage pipeline", "Human approval gate", "~9% of comments reach an LLM", "Hinglish + English intent scoring"],
    stack: ["Express 5", "Postgres + pgvector", "Gemini", "GPT", "Serper", "Apify"],
    image: { src: "/work/influencer-intelligence.webp", alt: "Influencer Intelligence: a prompt box asking for a campaign brief", width: 1567, height: 991 },
    host: "influencer.mesaschool.co.in",
  },
  {
    slug: "ai-cto",
    name: "The AI CTO",
    kind: "Build kit for non-technical founders",
    summary: "Decides what to build first, then scaffolds a production-ready project that coding agents build on.",
    detail:
      "An npx CLI with tiered stack kits, 14 module guides, and security and launch checklists. It works with Claude Code, Cursor and Codex CLI, and Mesa Startup Lab uses it to scaffold its incubated startups' products.",
    specs: ["npx CLI", "Tiered stack kits", "14 module guides", "Security + launch checklists"],
    stack: ["Node.js CLI", "Next.js 16", "TypeScript", "Supabase"],
    image: { src: "/work/ai-cto.webp", alt: "The AI CTO landing page: Your AI writes the code. Now it has a CTO.", width: 1600, height: 732 },
    host: "ai-cto-tan.vercel.app",
  },
];

/* ── Agent workflows, drawn as an n8n-style canvas ─────────────────────────── */

export type NodeKind = "trigger" | "agent" | "model" | "memory" | "tool" | "guard" | "human" | "output";

export interface FlowNode {
  id: string;
  label: string;
  /** The node type, as n8n would show it under the name. */
  type: string;
  kind: NodeKind;
  /** Canvas position, in a 1180 × 460 coordinate space. */
  x: number;
  y: number;
  /** What the node outputs when the run reaches it. */
  output: string;
}

export interface Workflow {
  slug: string;
  name: string;
  project: string;
  description: string;
  nodes: FlowNode[];
  /** [from, to]. Edges into a model or memory node are drawn as AI sub-connections. */
  edges: [string, string][];
  /** Node ids in execution order. */
  run: string[];
}

export const workflows: Workflow[] = [
  {
    slug: "nexus-ai",
    name: "Ask Nexus",
    project: "Nexus",
    description: "A staff question becomes guarded SQL over live data, or a RAG answer from documents, or both.",
    nodes: [
      { id: "chat", label: "Chat message", type: "Trigger", kind: "trigger", x: 20, y: 170, output: "1 question" },
      { id: "router", label: "Intent router", type: "AI Agent", kind: "agent", x: 240, y: 170, output: "intent: metrics" },
      { id: "flash", label: "Gemini Flash", type: "Chat model", kind: "model", x: 200, y: 350, output: "" },
      { id: "memory", label: "pgvector", type: "Memory", kind: "memory", x: 330, y: 350, output: "" },
      { id: "sql", label: "Text-to-SQL", type: "Tool", kind: "tool", x: 480, y: 60, output: "1 query" },
      { id: "rag", label: "RAG search", type: "Tool", kind: "tool", x: 480, y: 290, output: "4 chunks" },
      { id: "guard", label: "SQL guard", type: "Static check + repair", kind: "guard", x: 680, y: 60, output: "safe ✓" },
      { id: "db", label: "Postgres", type: "Read-only role", kind: "tool", x: 880, y: 60, output: "38 rows" },
      { id: "answer", label: "Answer", type: "SSE stream", kind: "output", x: 1080, y: 175, output: "streamed" },
    ],
    edges: [["chat", "router"], ["router", "flash"], ["router", "memory"], ["router", "sql"], ["router", "rag"], ["sql", "guard"], ["guard", "db"], ["db", "answer"], ["rag", "answer"]],
    run: ["chat", "router", "sql", "rag", "guard", "db", "answer"],
  },
  {
    slug: "influencer",
    name: "Creator discovery",
    project: "Influencer Intelligence",
    description: "Cheap models cast the net; a person approves; the frontier model scores only what's left.",
    nodes: [
      { id: "brief", label: "Campaign brief", type: "Webhook", kind: "trigger", x: 20, y: 170, output: "1 brief" },
      { id: "discover", label: "Discovery", type: "Serper + Apify", kind: "tool", x: 230, y: 170, output: "1,240 creators" },
      { id: "filter", label: "Fit filter", type: "AI Agent", kind: "agent", x: 440, y: 170, output: "212 kept" },
      { id: "flash", label: "Gemini Flash", type: "Chat model", kind: "model", x: 440, y: 350, output: "" },
      { id: "intent", label: "Intent scoring", type: "pgvector", kind: "tool", x: 650, y: 60, output: "~9% to LLM" },
      { id: "approve", label: "Brand approval", type: "Wait for human", kind: "human", x: 650, y: 280, output: "approved" },
      { id: "score", label: "Deep scoring", type: "AI Agent", kind: "agent", x: 860, y: 170, output: "40 scored" },
      { id: "gpt", label: "GPT", type: "Chat model", kind: "model", x: 860, y: 350, output: "" },
      { id: "shortlist", label: "Shortlist", type: "Output", kind: "output", x: 1040, y: 170, output: "top 15" },
    ],
    edges: [["brief", "discover"], ["discover", "filter"], ["filter", "flash"], ["filter", "intent"], ["filter", "approve"], ["intent", "score"], ["approve", "score"], ["score", "gpt"], ["score", "shortlist"]],
    run: ["brief", "discover", "filter", "intent", "approve", "score", "shortlist"],
  },
  {
    slug: "compass",
    name: "Idea validation",
    project: "Founder's Compass",
    description: "Flash extracts and searches, Pro mentors, and each of 8 stages feeds the score.",
    nodes: [
      { id: "idea", label: "Idea submitted", type: "Form trigger", kind: "trigger", x: 20, y: 170, output: "1 idea" },
      { id: "extract", label: "Extract + plan", type: "Gemini Flash", kind: "model", x: 230, y: 170, output: "6 queries" },
      { id: "search", label: "Search grounding", type: "Google Search", kind: "tool", x: 440, y: 60, output: "18 sources" },
      { id: "recall", label: "Founder memory", type: "Qdrant", kind: "memory", x: 440, y: 280, output: "3 notes" },
      { id: "mentor", label: "Stage mentor", type: "AI Agent · Gemini Pro", kind: "agent", x: 660, y: 170, output: "8 / 8 stages" },
      { id: "score", label: "Scorer", type: "Structured output", kind: "guard", x: 870, y: 170, output: "72 / 100" },
      { id: "plan", label: "Sprint plan", type: "Launch Pad agents", kind: "output", x: 1040, y: 170, output: "7-day plan" },
    ],
    edges: [["idea", "extract"], ["extract", "search"], ["extract", "recall"], ["search", "mentor"], ["recall", "mentor"], ["mentor", "score"], ["score", "plan"]],
    run: ["idea", "extract", "search", "recall", "mentor", "score", "plan"],
  },
];

export interface Role {
  company: string;
  title: string;
  period: string;
  place: string;
  points: string[];
}

export const experience: Role[] = [
  {
    company: "Mesa Startup Lab, Mesa School of Business",
    title: "AI & Technical Lead",
    period: "Aug 2025 – now",
    place: "Bengaluru",
    points: [
      "Founding engineer for the incubator's startups across ed-tech, ad-tech and women-only ride-hailing.",
      "Built Nexus (Mesa's LMS and its AI agent), Founder's Compass, Influencer Intelligence and The AI CTO.",
      "Set Mesa's engineering standard: typed SQL with Kysely, Zod-validated APIs with OpenAPI docs, rotating-JWT auth, Vitest, GCP.",
      "Control AI and vendor spend with model tiering and approval gates.",
    ],
  },
  {
    company: "Streambox Media",
    title: "Executive Frontend Developer",
    period: "Feb – May 2025",
    place: "Mumbai",
    points: [
      "Built DorWorld in Next.js with GSAP, Juspay payments and analytics, lifting its SEO and performance scores.",
      "Built APIs for the web platform and the Flutter DorTV app, and a WhatsApp + SMS notification engine.",
    ],
  },
  {
    company: "MYTE IT",
    title: "Frontend Developer",
    period: "Oct 2024 – Feb 2025",
    place: "Remote, Australia",
    points: [
      "Built a Next.js e-commerce platform on Apollo Client with GraphQL Codegen for fully typed data.",
      "Integrated MyFatoorah payments for Kuwait and a Strapi blog with role-based access.",
    ],
  },
  {
    company: "Kirana Friends",
    title: "Frontend Developer",
    period: "Apr – Jul 2024",
    place: "Mumbai",
    points: [
      "Shipped a React Native app with CleverTap analytics, a ChatGPT-style chatbot and a React admin dashboard.",
      "Built a sales-analysis tool that turns Excel uploads on S3 into store reports.",
    ],
  },
  {
    company: "Bunchup",
    title: "Tech Lead",
    period: "Feb – Dec 2023",
    place: "Mumbai",
    points: [
      "Built the React Native app for meeting people over shared interests, plus the website and an admin dashboard on 12+ APIs.",
    ],
  },
];

export const education = {
  school: "Thakur College of Engineering & Technology, Mumbai",
  degree: "B.E. Computer Science (Cyber Security)",
  period: "2021 – 2025",
  grade: "CGPI 9.2",
};

/** Rendered as a TypeScript file that types itself out. */
export const engineeringConfig: [key: string, value: string][] = [
  ["agents", "LangChain · tool-calling · guarded text-to-SQL · RAG with pgvector"],
  ["api", "Express 5 + Zod validation → OpenAPI docs, generated not handwritten"],
  ["data", "PostgreSQL + Kysely: typed SQL, migrations, no runtime ORM"],
  ["auth", "rotating JWT · role-based portals"],
  ["frontend", "Next.js 16 · TanStack Query · shadcn/ui · GSAP"],
  ["quality", "TypeScript strict · Vitest"],
  ["ship", "Docker → Cloud Build → Cloud Run"],
  ["aiCost", "cheap models for discovery, frontier models only where they earn it"],
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Agentic AI",
    items: ["LangChain", "LangGraph", "Multi-agent orchestration", "Text-to-SQL", "RAG", "Qdrant", "pgvector", "Gemini (Vertex AI)", "Azure OpenAI"],
  },
  {
    group: "Backend & data",
    items: ["TypeScript", "Python", "Node.js", "Express 5", "FastAPI", "PostgreSQL", "Kysely", "Prisma", "MongoDB", "Redis", "Socket.IO"],
  },
  {
    group: "Frontend & mobile",
    items: ["React 19", "Next.js 16", "TanStack Query", "Tailwind", "shadcn/ui", "GSAP", "React Native", "Expo"],
  },
  {
    group: "Cloud",
    items: ["Cloud Run", "App Engine", "Cloud Build", "Secret Manager", "Firebase", "Docker", "AWS S3 / SES"],
  },
];

/** Suggested first questions in the chat widget. */
export const chatStarters = [
  "What did you build at Mesa?",
  "How does Nexus AI keep text-to-SQL safe?",
  "Which stack would you pick for my MVP?",
  "Are you open to new projects?",
];

/** Section ids double as the trace-rail stages and command-palette targets. */
export const sections = [
  { id: "top", label: "Input" },
  { id: "approach", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "workflows", label: "Workflows" },
  { id: "impact", label: "Impact" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
