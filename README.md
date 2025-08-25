## EventMania

All‑in‑one event management and ticketing platform built with Next.js App Router. Organizers can create events, accept payments, issue QR‑coded tickets, and verify entries. Attendees can explore events, purchase tickets, and manage their bookings.

### Features
- **Authentication and Security**: Email/password with email verification, OAuth (Google, GitHub), optional 2FA, protected routes via middleware.
- **Event Management**: Create and manage events with category, date/time, location, price, total seats, banner, rules, and external links.
- **Ticketing**: Purchase flow, ticket issuance, download templates, tabs, and status (claimed/unclaimed).
- **Payments**: Razorpay order creation + capture verification; UPI dialog component available; PayPal button helper included.
- **QR Scanning & Verification**: In‑app QR code scanner for ticket verification by organizers; server verification endpoint prevents double entry.
- **Explore & Search**: Public explore page with filters; server search API for admins.
- **Dashboard & Analytics**: Organizer dashboard and a ticket sales chart component.
- **Email Delivery**: Transactional emails (verification, password reset, 2FA) via Resend.
- **Theming & UI**: Dark mode, shadcn/ui components, Tailwind CSS.

### Tech Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Auth**: NextAuth v5 (beta) with credentials + Google + GitHub
- **Database/ORM**: PostgreSQL + Prisma 6
- **UI**: Tailwind CSS v4, shadcn/ui (Radix UI), Lucide icons
- **Validation**: Zod, React Hook Form
- **Payments**: Razorpay (server), UPI dialog (client), PayPal helper (client)
- **Email**: Resend

### Key Directories
- `app/` — App Router routes (public auth pages, protected sections, API routes)
- `components/` — Reusable UI, auth, events, tickets, scanner, dashboard
- `lib/` — `db` (Prisma client), `auth`, `mail`, `tokens`, `utils`, `payment`
- `prisma/` — Prisma schema and migrations
- `actions/` — Server actions for auth/settings flows
- `data/` — Data access helpers for users, tokens, accounts

### Core Models (Prisma)
- `User` with role, OAuth accounts/sessions, 2FA flags
- `Event` with category, status, pricing, total seats, `externalLinks` JSON, `upiId`, organizer relation
- `Ticket` with claimed state and timestamps, relations to user and event

### API Routes (selected)
- `POST /api/events` — Create event (auth required)
- `POST /api/tickets` — Purchase ticket placeholder (auth required; seats check)
- `POST /api/tickets/verify` — Verify and mark ticket as claimed (organizer only)
- `POST /api/payments` — Create Razorpay order for an event
- `POST /api/payments/verify` — Verify captured payment, create ticket, transfer funds
- `GET /api/search?query=...` — Admin‑only search over users
- `GET /api/auth/[...nextauth]` — NextAuth routes

### Authentication and Middleware
- `middleware.ts` protects non‑public routes, redirects unauthenticated users to ` /auth/login` with `callbackUrl`.
- Public and auth routes configured in `routes.ts`.
- NextAuth configured in `auth.ts` and `auth.config.ts` with Prisma adapter and JWT sessions.

### Environment Variables
Create a `.env` file with the following:

```bash
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-strong-secret"
NEXTAUTH_URL="http://localhost:3000"            # Set in production to your domain

# OAuth Providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# Emails (Resend)
RESEND_API_KEY="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"      # Used in email links

# Payments (Razorpay)
RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."
```

Notes:
- If you use PayPal helper (`lib/payment.ts`), include the PayPal SDK script on relevant pages with your client ID.
- UPI dialog is a client‑side component; you may integrate with your PSP or Razorpay UPI as needed.

### Getting Started
1) Install dependencies
```bash
npm install
```

2) Generate Prisma client
```bash
npm run postinstall   # or: npx prisma generate
```

3) Run migrations (ensure `DATABASE_URL` is set)
```bash
npx prisma migrate dev
```

4) Start the dev server
```bash
npm run dev
```

App runs at `http://localhost:3000`.

### Scripts
- `dev` — Start Next.js in development
- `build` — Build for production
- `start` — Run production server
- `lint` — Run ESLint
- `postinstall` — Generate Prisma client

### Protected App Areas
- `/(protected)/dashboard` — Organizer dashboard
- `/(protected)/events` — List, details (`/[id]`), create
- `/(protected)/tickets` — Ticket management, templates, downloads
- `/(protected)/scanner` — QR scanner and verification flow
- `/(protected)/explore` — Explore events
- `/(protected)/settings` — User settings

### UI Components Highlights
- `components/events/*` — Forms (basic info, details, rules/links), grid/cards, share dialog
- `components/tickets/*` — Ticket templates, tabs, downloads
- `components/scanner/*` — QR scanner components
- `components/dashboard/*` — Sidebar and `TicketSalesChart`

### Payment Flow (Razorpay)
1. Client requests `POST /api/payments` with `eventId` to create an order.
2. Complete payment on client using the returned order id.
3. Server verifies via `POST /api/payments/verify`, issues ticket, and initiates transfer.

### Security Considerations
- Organizer‑only verification enforced server‑side.
- Seat availability enforced before ticket creation.
- JWT session tokens enriched with role and 2FA states.

### License
Proprietary — for internal or project use. Update this section if you choose an open‑source license.


