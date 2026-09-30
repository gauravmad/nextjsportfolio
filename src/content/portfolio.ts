/**
 * Every word on the portfolio lives here, so copy edits never touch components.
 * Source of truth: resume (Oct 2026), LinkedIn headline, GitHub profile.
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

export interface Metric {
  before?: string;
  value: string;
  label: string;
  context: string;
}

export const metrics: Metric[] = [
  {
    before: "₹7–8L",
    value: "₹45–50L",
    label: "monthly revenue",
    context: "Ed-tech startup, after I set up its tech and automated operations end to end",
  },
  {
    value: "₹40L",
    label: "pre-seed raised",
    context: "Ad-tech startup whose product I built end to end",
  },
  {
    value: "1,000+",
    label: "users on Mesa LMS",
    context: "Three live cohorts, five role-based portals, 38 modules, one engineer",
  },
  {
    value: "45×",
    label: "cheaper by design",
    context: "Influencer Intelligence sends only ~9% of comments to an LLM",
  },
  {
    before: "weeks",
    value: "minutes",
    label: "ops turnaround",
    context: "Careers CRM, procure-to-pay finance and Sheets sync replaced Excel at Mesa",
  },
];

export interface Project {
  slug: string;
  name: string;
  summary: string;
  detail: string;
  /** The business outcome, shown first and largest. */
  outcome: { value: string; label: string };
  /** Hard engineering facts that back the outcome up. */
  specs: string[];
  stack: string[];
  /** The architecture as a left-to-right pipeline, drawn on scroll. */
  pipeline: string[];
  href?: string;
}

export const projects: Project[] = [
  {
    slug: "mesa-lms",
    name: "Mesa LMS",
    summary: "Replaced Moodle for a business school, as its only engineer.",
    detail:
      "38 product modules and five portals (admin, student, professor, mentor, parent) serving every live cohort. It saved an estimated ₹40–50 lakh against the vendor route.",
    outcome: { value: "₹40–50L", label: "saved vs. the vendor route" },
    specs: ["39 API modules, 56 frontend features", "5 role-based portals", "1,000+ users across 3 cohorts", "655 commits, sole engineer"],
    stack: ["Next.js 16", "Express 5", "PostgreSQL", "Kysely", "GCP"],
    pipeline: ["Next.js portals", "Express 5 API", "Zod + OpenAPI", "Kysely", "Cloud SQL", "App Engine"],
    href: "https://students.mesaschool.co.in",
  },
  {
    slug: "nexus-ai",
    name: "Nexus AI",
    summary: "An agent inside the LMS that answers from live data.",
    detail:
      "Routes each question across 10 intent types to text-to-SQL, RAG over documents, or both. Model-written SQL is statically guarded, auto-repaired and run under a read-only Postgres role.",
    outcome: { value: "10", label: "intent types routed to SQL, RAG or both" },
    specs: ["Static SQL guard + auto-repair", "Read-only Postgres role", "pgvector memory", "SSE streaming"],
    stack: ["LangChain", "pgvector", "PostgreSQL", "SSE"],
    pipeline: ["Question", "Intent router", "Text-to-SQL · RAG", "SQL guard", "Read-only role", "Streamed answer"],
  },
  {
    slug: "founders-compass",
    name: "Founder's Compass",
    summary: "An AI mentor that scores a startup idea out of 100.",
    detail:
      "Eight validation stages driven by a two-model loop: Gemini Pro mentors while Gemini Flash extracts structure and writes search queries, grounded in live Google Search and RAG memory. Launch Pad turns the idea into a 7–10 day sprint plan.",
    outcome: { value: "8", label: "validation stages to a scored verdict" },
    specs: ["Two-model agent loop (Pro + Flash)", "Live Google Search grounding", "Qdrant RAG memory", "7–10 day sprint plans"],
    stack: ["FastAPI", "Gemini (Vertex AI)", "Qdrant", "MongoDB", "Redis", "Next.js"],
    pipeline: ["Idea", "Gemini Flash extract", "Search grounding", "Gemini Pro mentor", "Qdrant memory", "Score / 100"],
    href: "https://compass-msl.mesaschool.co.in",
  },
  {
    slug: "influencer-intelligence",
    name: "Influencer Intelligence",
    summary: "From a one-line brief to a ranked creator shortlist.",
    detail:
      "A 13-stage pipeline with a human approval gate. Cheap discovery first (Serper, Apify, Gemini Flash), frontier-model scoring only on the brand's shortlist, and Hinglish + English purchase-intent scoring through pgvector.",
    outcome: { value: "~45×", label: "cheaper LLM spend by design" },
    specs: ["13-stage pipeline", "Human approval gate", "Only ~9% of comments reach an LLM", "Hinglish + English intent scoring"],
    stack: ["Express 5", "Postgres + pgvector", "Gemini", "GPT"],
    pipeline: ["Brief", "Cheap discovery", "Intent vectors", "Human approval", "GPT scoring", "Shortlist"],
    href: "https://influencer.mesaschool.co.in",
  },
  {
    slug: "careers-crm",
    name: "Careers CRM",
    summary: "The B-school's placements and programme ops, off Excel.",
    detail:
      "Career pathways, placement prep, an AI portfolio builder and programme operations in one system, with scheduled Google Sheets sync for the teams that still live in spreadsheets.",
    outcome: { value: "weeks → min", label: "turnaround on ops requests" },
    specs: ["FastAPI + MongoDB", "LangGraph AI portfolio", "Scheduled Sheets sync", "257 commits"],
    stack: ["FastAPI", "MongoDB", "LangGraph", "Next.js", "GCP"],
    pipeline: ["Next.js app", "FastAPI", "LangGraph agents", "MongoDB", "Sheets sync"],
    href: "https://careers-crm.mesaschool.co.in",
  },
  {
    slug: "ai-cto",
    name: "The AI CTO",
    summary: "A build kit that lets non-technical founders ship with AI agents.",
    detail:
      "An npx CLI with tiered stack kits, 14 module guides, and security and launch checklists. Mesa Startup Lab uses it to scaffold its incubated startups' products.",
    outcome: { value: "0 → prod", label: "for non-technical founders" },
    specs: ["npx CLI", "Tiered stack kits", "14 module guides", "Security + launch checklists"],
    stack: ["Node.js CLI", "Next.js 16", "TypeScript"],
    pipeline: ["npx ai-cto", "Pick a tier", "Scaffold kit", "Module guides", "Launch checklist"],
    href: "https://ai-cto-tan.vercel.app",
  },
  {
    slug: "founder-fusion",
    name: "Founder Fusion & MSL Portal",
    summary: "Co-founder matching, plus booking for founders and track heads.",
    detail:
      "Two of Mesa Startup Lab's own products on GCP, used day to day by the incubator's founders and mentors.",
    outcome: { value: "2", label: "incubator products in daily use" },
    specs: ["Co-founder matching", "Founder + track-head booking", "~25 FastAPI modules: scores, mentor slots, grants", "Sole author"],
    stack: ["Next.js", "Node.js", "GCP"],
    pipeline: ["Founder profiles", "Matching", "Booking", "Notifications"],
    href: "https://msl-portal.mesaschool.co.in",
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
      "Built Mesa LMS, Nexus AI, Founder's Compass, Influencer Intelligence and The AI CTO.",
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
    items: ["LangChain", "Multi-agent orchestration", "Text-to-SQL", "RAG", "Qdrant", "pgvector", "Gemini (Vertex AI)", "Azure OpenAI"],
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

/** Engineering throughput, verified from the GitHub API (Oct 2026). */
export const gitStats: { value: string; label: string }[] = [
  { value: "2,130", label: "commits across Mesa's org" },
  { value: "39 / 52", label: "Mesa repos I've shipped to" },
  { value: "13", label: "Mesa products live" },
  { value: "6,018", label: "commits on GitHub, all time" },
];

export interface Deployment {
  name: string;
  host: string;
  what: string;
}

/** Live products from the Mesa org that I built or led. All public URLs. */
export const deployments: Deployment[] = [
  { name: "mesa-lms", host: "students.mesaschool.co.in", what: "LMS for 5 roles, with Nexus AI" },
  { name: "careers-crm", host: "careers-crm.mesaschool.co.in", what: "Placements and programme ops" },
  { name: "msl-portal", host: "msl-portal.mesaschool.co.in", what: "Founders OS for the incubator" },
  { name: "founders-compass", host: "compass-msl.mesaschool.co.in", what: "AI idea validation" },
  { name: "influencer-intel", host: "influencer.mesaschool.co.in", what: "Creator discovery for D2C brands" },
  { name: "horizon", host: "horizon.mesaschool.co.in", what: "AI verdicts on MBA case answers" },
  { name: "msl-nxt", host: "msl-nxt.mesaschool.co.in", what: "Demo Day investor room" },
  { name: "ideabaaz", host: "ideabaaz.mesaschool.co.in", what: "Startup festival platform" },
  { name: "msl-startups", host: "msl.mesaschool.co.in", what: "Portfolio of MSL startups" },
  { name: "ai-cto", host: "ai-cto-tan.vercel.app", what: "Build kit for non-technical founders" },
];

/** Section ids double as the trace-rail stages and command-palette targets. */
export const sections = [
  { id: "top", label: "Input" },
  { id: "approach", label: "Approach" },
  { id: "impact", label: "Impact" },
  { id: "work", label: "Work" },
  { id: "live", label: "Live" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
