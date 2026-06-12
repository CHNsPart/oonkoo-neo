# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack (localhost:3000)
npm run build    # prisma generate --no-engine && prisma migrate deploy && next build
npm run start    # Production server
npm run lint     # next lint (ESLint 9, eslint-config-next)
```

There is no test suite. `npm install` runs `prisma generate` via `postinstall`. The build (and Vercel deploy) runs `prisma migrate deploy` against `DATABASE_URL`, so a build will mutate the connected database — point `DATABASE_URL` at the right environment before building.

`next build` does NOT lint (`eslint.ignoreDuringBuilds: true` in `next.config.ts`, because Next 15's build-time ESLint can't see the ESLint 9 flat config) — a green build says nothing about lint; run `npm run lint` explicitly.

Use **npm**, not pnpm — the lockfile is `package-lock.json` and `vercel.json` pins `npm install` (the README's pnpm instructions are stale).

## Architecture

This is a Next.js 15 (App Router) application that is two apps in one codebase:

1. **Public marketing site** — home, services, pricing, blogs, case studies, about, careers, etc. Mostly client components with heavy animation (motion/Framer Motion, OGL/WebGL, custom cursor). Rendered inside the global chrome in `app/layout.tsx` (Header → main → Footer, wrapped in `LoaderWrapper` + `BlobCursor` + `KindeProvider`).
2. **Authenticated dashboard / client portal** — `app/dashboard/*`, an admin + client CRM for managing clients, leads, project/sale inquiries, projects, and services.

`docs/OONKOO_DASHBOARD_EXECUTIVE_OVERVIEW.md` is a strategic planning doc — partly aspirational and partly outdated (it describes the old binary `isAdmin` system). Trust the code over that doc for current behavior, but it's useful for business context.

### Authentication & RBAC

This is the most important system to understand before touching the dashboard or API.

- **Auth provider:** Kinde (`@kinde-oss/kinde-auth-nextjs`). `middleware.ts` protects only `/dashboard/:path*` — API routes are NOT covered by middleware and must authorize themselves.
- **Roles & permissions** are defined in `types/permissions.ts`: a role hierarchy (`VIEWER < CLIENT < MANAGER < ADMIN < SUPER_ADMIN`) plus granular `Permission`s. `ROLE_PERMISSIONS` maps each role to its default permissions. Mirror these in `prisma/schema.prisma` (`Role` / `Permission` enums) when changing them.
- **Effective permissions** = role defaults merged with the user's custom `permissions[]` array, via `getEffectivePermissions()`.
- **SUPER_ADMIN is hardcoded by email** (`SUPER_ADMIN_EMAIL` in `types/permissions.ts`). On every login the user is upserted and, if their email matches, force-promoted to SUPER_ADMIN. Only SUPER_ADMIN can manage other users' roles/permissions.
- **User records are created lazily**, not by a webhook: `getCurrentUser()` (`lib/auth-utils.ts`, server) and `GET /api/user/db-sync` (client, called via `lib/api.ts`) both `prisma.user.upsert` the Kinde user into the DB on access.

**Securing API routes** — use the wrappers in `lib/permissions.ts` rather than re-implementing auth:
- `withAuthorization(permission, handler)` — requires a single permission.
- `withAnyAuthorization([permissions], handler)` — OR logic.
- `withSuperAdminAuthorization(handler)` — SUPER_ADMIN only.

These resolve the Kinde session, load the user, compute effective permissions, and pass an `AuthContext` to the handler (or return 401/403/404). Some existing routes (e.g. `app/api/services/route.ts`) instead inline the `getKindeServerSession` → `prisma.user.findUnique` → `getEffectivePermissions` → `hasPermission` pattern and branch validation/behavior by permission — follow whichever style matches the file you're editing, but always gate on permissions, never on email or `isAdmin`.

**Data scoping:** non-admin users see only their own rows. The pattern is to build the Prisma `where` clause conditionally — `canManageX ? {} : { userId: user.id }`. `getDataScope()` formalizes this ('all' vs 'own'). The legacy `isAdmin` boolean still exists on `User` for backward compatibility but role/permissions are the source of truth.

### Data layer

- **Prisma + PostgreSQL.** Client singleton in `lib/prisma.ts` includes a `$extends` result extension adding a computed `user.fullName`. Always import `{ prisma }` from `@/lib/prisma`. (Ignore the `@libsql/*` / `@prisma/adapter-libsql` / Accelerate / Pulse packages in `package.json` — they are unused; the datasource is plain PostgreSQL.)
- IDs are **ULIDs** (`@default(ulid())`), not UUIDs/autoincrement.
- Some fields are JSON-in-string (`Project.features`) or real `Json` columns (`Service.externalLinks`) — check the schema before assuming a shape.
- Migrations live in `prisma/migrations/`. Add migrations with `prisma migrate dev`; the deploy pipeline applies them with `prisma migrate deploy`.

### Dashboard data flow

Each resource follows a consistent triple:
- **API route** `app/api/<resource>/route.ts` (+ `[id]/route.ts`) — permission-gated CRUD.
- **Hook** `hooks/use-<resource>.ts` — client-side `fetch` wrapper exposing `{ data, loading, error, mutate, ...actions }`.
- **UI** under `components/dashboard/<resource>/` — forms (`*-form.tsx`), detail modals (`*-details-modal.tsx`), rendered through the generic view components in `components/dashboard/data-view/` (`data-grid`, `data-cards`, `view-toggle`, `pagination`, `confirmation-modal`) driven by `hooks/use-data-view.ts`.

The dashboard root (`app/dashboard/page.tsx`) shows `AdminDashboard` vs `UserDashboard` based on the `VIEW_ANALYTICS` permission (via `usePermissions`). Input validation uses Zod schemas in `lib/validations/`.

### Content (blogs, case studies, pricing)

Marketing content is **static TypeScript data, not a CMS or DB**:
- Blogs: `lib/data/blog-data.ts` (+ `blogs.ts`), accessed via `lib/blog.ts` helpers.
- Case studies, pricing, services, sales: `constants/*.ts`.
- Markdown rendering uses `react-markdown` / `remark`; SEO JSON-LD components live in `components/seo/`.

## Conventions

- **Path alias:** `@/*` maps to the repo root (e.g. `@/lib/prisma`, `@/components/ui/button`).
- **UI components:** shadcn/ui ("new-york" style) in `components/ui/`. Config in `components.json` also wires custom registries (`@magicui`, `@react-bits`, `@aceternity`) — install components via the shadcn CLI when possible. `cn()` from `@/lib/utils` for class merging.
- **Styling:** Tailwind CSS. Brand color is `brand-primary` (see `tailwind.config.ts`); the app is dark-themed (`bg-black`).
- Reusable React hooks live in `hooks/`; pure helpers in `lib/`; shared types in `types/`.
- `NEXT_PUBLIC_APP_URL` is used for absolute URLs (sitemap, OG images, API base in `lib/api.ts`); falls back to `https://oonkoo.com` / `localhost:3000`.
