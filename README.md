# Smart Group Solution — Website + Admin CMS

A premium single-page website with a full, database-free admin content
management system. Built with Next.js 16, TypeScript, Tailwind CSS, Framer
Motion and NextAuth.

Every section of the public site — Home, About, Pillars, Services, Impact,
Industries, Team and Contact — is fully editable from the admin dashboard. No
database server is required: content is stored in a single JSON file on disk.

## Features

### Public website
- Interactive universe / neural-network background
- All content served from the file-based content store (nothing hardcoded)
- Contact form submissions saved to the store and viewable in the admin inbox
- Dark / light theme, scroll animations, glassmorphism UI

### Admin panel (`/admin`)
- Secure, environment-variable based login (no user database)
- **Dashboard** — stats overview and quick links to every section
- **Home / About / Contact** — rich settings forms for all copy, CTAs,
  statistics, story, mission/vision, map embed, social links and form settings
- **Pillars / Services / Industries / Team** — full CRUD with search, filtering,
  sorting, pagination, bulk publish/unpublish/delete and drag-and-drop reorder
- **Impact** — statistics, cost-of-inaction items and success stories
- **Messages** — view contact submissions, mark read/unread, bulk actions
- Toast notifications, skeleton loaders, empty states, confirmation dialogs,
  image upload with drag-and-drop and live preview, draft/publish workflow

## Setup

No database is required.

```bash
npm install
npm run dev      # development
# or
npm run build
npm run start    # production
```

- **Website:** [http://localhost:3000](http://localhost:3000)
- **Admin:** [http://localhost:3000/admin](http://localhost:3000/admin)

On first run the content store is seeded automatically from
`src/lib/site-defaults.ts` into `data/content.json`.

## Admin credentials

Login is configured entirely through environment variables — see `.env.example`.

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_EMAIL` | `admin@smartgroupsolution.com` | Admin login email |
| `ADMIN_PASSWORD` | `Admin123!` | Plain-text password |
| `ADMIN_PASSWORD_HASH` | — | Optional bcrypt hash (takes precedence over `ADMIN_PASSWORD`) |
| `ADMIN_NAME` | `Administrator` | Display name |
| `NEXTAUTH_SECRET` | — | Long random string used to sign sessions |
| `NEXTAUTH_URL` | `http://localhost:3000` | Base URL |
| `CONTENT_FILE` | `./data/content.json` | Optional custom path for the content store |

**Change the credentials and set a strong `NEXTAUTH_SECRET` before deploying to
production.**

## How content persistence works

- All site content lives in a single JSON file (default `data/content.json`).
- Writes are atomic (write-to-temp then rename) with an in-memory cache.
- Publishing a change in the dashboard writes to the file and the public site
  reflects it immediately (the homepage renders on each request).
- To reset content, stop the server, delete `data/content.json`, and restart —
  it will re-seed from the defaults.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   └── (dashboard)/     # Protected CMS pages (one per section)
│   ├── api/
│   │   ├── collections/     # Generic CRUD for all collections
│   │   ├── content/         # Singleton site content
│   │   ├── messages/        # Contact inbox
│   │   └── upload/          # Image uploads
│   └── page.tsx             # Public site (dynamic)
├── components/
│   ├── admin/               # Admin shell, managers, forms, UI primitives
│   ├── background/          # Universe canvas
│   ├── layout/              # Navbar, footer, etc.
│   └── sections/            # Public page sections
├── lib/
│   ├── content-store.ts     # File-based JSON store (CRUD + atomic writes)
│   ├── site-defaults.ts     # Default seed content
│   ├── collections.ts       # Collection field schemas + validation
│   ├── section-schemas.ts   # Settings-form field groups per section
│   └── auth-options.ts      # Env-based NextAuth config
└── types/                   # Shared TypeScript types
data/
└── content.json             # Runtime content store (git-ignored)
```

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- NextAuth.js (credentials, env-based)
- @dnd-kit (drag-and-drop)
- File-based JSON persistence (no database)
