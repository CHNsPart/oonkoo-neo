# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server with Turbopack (http://localhost:3000)
pnpm build        # Generate Prisma client, run migrations, build Next.js
pnpm lint         # Run ESLint
pnpm start        # Start production server
```

Database commands:
```bash
npx prisma generate    # Regenerate Prisma client after schema changes
npx prisma migrate dev # Create and apply migrations in development
npx prisma studio      # Open Prisma Studio GUI
```

## Architecture

### Tech Stack
- **Framework:** Next.js 15.1 with App Router and Turbopack
- **Database:** PostgreSQL with Prisma ORM (uses ULID primary keys)
- **Auth:** Kinde OAuth (`@kinde-oss/kinde-auth-nextjs`)
- **Styling:** Tailwind CSS + shadcn/ui + Radix UI
- **Animations:** Motion (Framer Motion)

### Project Structure

```
app/
├── (public pages)     # Home, services, pricing, about-us, careers, blogs
├── dashboard/         # Protected admin/user dashboard (CRUD for projects, clients, leads, services)
├── api/               # REST endpoints for all resources
└── client-portal/     # Login page

components/
├── pages/             # Page-specific sections (hero, footer, cards, pricing, blog)
├── ui/                # shadcn/ui components (button, card, dialog, etc.)
├── dashboard/         # Dashboard CRUD components
├── wrapper/           # Layout wrappers (header, loader)
└── cursor/            # Custom blob cursor

lib/
├── prisma.ts          # Prisma singleton with fullName computed field
├── utils.ts           # cn(), serializeUser(), currency helpers
├── blog.ts            # Blog data fetching utilities
├── project-calculations.ts  # Pricing calculation logic
└── validations/       # Zod schemas for forms
```

### Authentication Flow
1. Kinde handles OAuth login via `/api/auth/[kindeAuth]/route.ts`
2. Middleware (`middleware.ts`) protects `/dashboard/*` routes
3. `/api/user` syncs Kinde user to PostgreSQL on first login
4. Admin determined by email check in `lib/admin-utils.ts`

### Database Models (Prisma)
- **User** - Synced from Kinde, has projects and services
- **Project** - Client projects with pricing (features stored as JSON string)
- **Service** - Subscribed services tied to users
- **Lead** - Sales leads from website forms
- **ProjectInquiry** / **SaleInquiry** - Form submissions for quotes

### API Pattern
All resources follow REST conventions:
- `GET /api/[resource]` - List (admins see all, users see own)
- `POST /api/[resource]` - Create
- `GET/PUT/DELETE /api/[resource]/[id]` - Single resource operations

Auth check via `getKindeServerSession()`, input validation via Zod.

### Pricing System
- Plan definitions in `constants/pricing.ts`
- Feature types: toggle, select, tiers, included
- Calculations in `lib/project-calculations.ts` (one-time + recurring costs)
- Currency conversion (USD/CAD) in `lib/utils.ts`

### Blog System
- Static blog data in `lib/data/blog-data.ts`
- Utilities in `lib/blog.ts` (getAllBlogs, getBlogBySlug, getRelatedBlogs)
- Uses `generateStaticParams` for pre-rendering

## Key Patterns

### Component Styling
Use the `cn()` utility for conditional Tailwind classes:
```tsx
import { cn } from "@/lib/utils"
cn("base-class", condition && "conditional-class")
```

### Brand Colors
```
brand-primary: #3CB371 (Medium Sea Green)
brand-dark: #000000
brand-light: #FFFFFF
```

### Path Alias
`@/*` maps to project root (e.g., `@/components/ui/button`)

### Server vs Client
- API routes use `getKindeServerSession()` for auth
- Client components use `useKindeAuth()` hook
- Custom hooks in `hooks/` folder for data fetching (useProjects, useClients, etc.)
