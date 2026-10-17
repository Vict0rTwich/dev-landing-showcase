# Volans landing page

A dark, production-ready landing page for **Volans**, a fictional edge deployment platform. Built with
Next.js 16 (App Router, Turbopack, Cache Components), Tailwind CSS 4, Motion (the library formerly
called Framer Motion) and lucide-react.

The hero centers on a live deploy console. One `git push` streams through build steps and logs, then
fans out to 34 edge regions labelled by IATA code. Visitors can replay it and switch between the
Deployment, Logs and Analytics views.

## What's inside

| Section  | Highlights                                                                                    |
| -------- | --------------------------------------------------------------------------------------------- |
| Header   | Sticky, blurs on scroll, live status pill, accessible mobile menu (Escape and scrim close it) |
| Hero     | Animated gradient headline, glowing primary CTA, copy-to-clipboard CLI command, telemetry     |
| Console  | Scripted deploy with keyboard tabs, synced log stream, interactive area chart with crosshair  |
| Features | Six-cell hairline matrix whose borders light up around the cursor                             |
| Pricing  | Monthly/yearly toggle with rolling prices, highlighted Pro plan with a traced conic border    |
| Footer   | Newsletter form with validation and loading/success/error states, link groups, status         |

Also included: a branded 404 page, generated Open Graph image, SVG favicon, `robots.txt`, `sitemap.xml`,
security headers and a `/api/subscribe` route handler.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start the dev server with Turbopack   |
| `npm run build`     | Create a production build             |
| `npm run start`     | Serve the production build            |
| `npm run lint`      | Lint with ESLint (Next.js config)     |
| `npm run typecheck` | Type-check with `tsc`                 |
| `npm run format`    | Format with Prettier, sorting classes |

## Project structure

```
app/
  layout.tsx            Fonts, metadata, header and footer shell
  page.tsx              Hero, Features, Pricing
  globals.css           Design tokens, type roles and utilities (Tailwind 4, CSS-first)
  not-found.tsx         Branded 404
  opengraph-image.tsx   Social card, generated at build time
  api/subscribe/        Newsletter endpoint
components/
  ui/                   Primitives: button, badge, glow, spotlight grid, copy controls, logo
  console/              The hero deploy console and its three panels
  sections/             Hero, Features, Pricing
  layout/               Site header, footer, newsletter form
lib/
  site.ts               Brand copy, navigation and footer links
  data/                 Pricing plans, features, deployment script and analytics data
```

## Customizing

- **Copy and links:** `lib/site.ts` holds the name, tagline, navigation and footer links.
  `lib/data/` holds plans, features and the scripted deployment.
- **Design tokens:** colors, glows and type roles live at the top of `app/globals.css`. Tailwind's
  default palette is switched off, so every color utility (`bg-surface`, `text-muted-foreground`,
  `border-border`) maps to a token.
- **Fonts:** Archivo (its width axis drives the expanded display type) and IBM Plex Mono, loaded with
  `next/font` in `app/layout.tsx`.

## Before you go live

1. **Build or remove placeholder routes.** Links to `/docs`, `/changelog`, `/login`, `/signup` and
   `/contact` show the 404 page until those pages exist.
2. **Connect the newsletter.** `app/api/subscribe/route.ts` validates the address and returns success.
   Forward the email to your provider (Resend, Loops, Mailchimp and so on) where the comment marks it.
3. **Set your domain.** Add `NEXT_PUBLIC_SITE_URL` (for example `https://volans.dev`) so Open Graph
   tags and the sitemap use it. On Vercel the production URL is picked up automatically until then.

## Deploy to Vercel via GitHub

1. Commit the project:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Volans landing page"
   git branch -M main
   ```

2. Create an empty repository on GitHub and push to it. With the GitHub CLI:

   ```bash
   gh repo create volans-landing --private --source=. --push
   ```

   Or create the repository on github.com, then run
   `git remote add origin <repo-url>` and `git push -u origin main`.

3. Go to [vercel.com/new](https://vercel.com/new), import the repository and click **Deploy**.
   Vercel detects Next.js; the default build settings work as they are.

4. Optional: under **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL`, and attach your
   domain under **Settings → Domains**.

After that, every push to `main` deploys to production, and every pull request gets its own preview URL.
To deploy from the terminal instead, run `npx vercel` and then `npx vercel --prod`.

## Accessibility and performance

- Respects `prefers-reduced-motion`: the console jumps to its finished state and ambient motion stops.
- Full keyboard support: skip link, arrow-key tabs, arrow-key chart readout, visible focus rings.
- Text contrast is at least 4.5:1 against every surface.
- Every page is prerendered as static HTML; fonts are self-hosted by `next/font`.
