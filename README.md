# Gaurav Madan: Portfolio

Next.js 16 (App Router, Turbopack, React Compiler) · React 19 · TypeScript (strict) ·
Tailwind CSS v4 · shadcn/ui · TanStack Query · Zod

```bash
cp .env.example .env.local   # then fill in
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + lint
npm run build
```

## Structure

```
src/
  app/                 routes and layouts only; pages stay thin
    api/               Route Handlers. See src/app/api/README.md
  features/<feature>/  domain slices: schemas · services · hooks · components, behind index.ts
  components/ui/       shadcn/ui primitives (vendored; manage with `npx shadcn@latest add`)
  lib/api/             browser API client, ApiError, endpoint paths
  lib/config/          Zod-validated env, site metadata
  providers/           client providers (Query, theme, toasts, tooltips)
  hooks/               generic hooks
  types/               shared types (API envelope)
```

Data always flows **component → hook → service → `lib/api/client` → `/api/*`**.
ESLint enforces the boundaries: features are imported through their barrel,
`app/api/_lib` is server-only, and there are no deep relative imports.

## Environment

See [.env.example](.env.example). All variables are validated in
`src/lib/config/env.ts`. A bad public variable fails the production build.
