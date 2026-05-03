# Raivis Deutschman — Fine Art Commerce

Editorial e-commerce front end for limited-edition works: **Next.js 16 (App Router)**, **Tailwind CSS 4**, **shadcn/ui**, **Storybook**, **Supabase** (client helpers), and **Stripe** (checkout session API skeleton). UI routes mirror the linked Figma frames (home, portfolio / “Residue”, curate grid & detail, cart, checkout summary, about).

## Scripts

```bash
npm run dev        # Next.js dev server
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # ESLint
npm run storybook  # Component workshop
```

## Environment

Copy `.env.example` to `.env.local` and fill values from the Supabase and Stripe dashboards. `getSupabaseBrowser()` returns `null` until `NEXT_PUBLIC_SUPABASE_*` are set, so the storefront still runs for local UI work.

## Routes

| Path | Figma reference |
|------|------------------|
| `/` | Home hero + caption |
| `/portfolio` | Long-form “Residue” / series |
| `/curate` | Grid |
| `/curate/[slug]` | Edition detail + “Inquire / add to cart” |
| `/cart` | Cart |
| `/checkout` | Order summary + Stripe placeholder |
| `/about` | Myth / about |

Demo imagery uses Unsplash via `next/image` remote patterns. Replace URLs in `src/lib/demo-content.ts` with exports from your Figma asset pipeline or Supabase Storage.

## Deploy on Vercel + domain on Hostinger

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In [Vercel](https://vercel.com/new), import the repo, set **Root Directory** if needed, and add environment variables from `.env.example`.
3. Deploy; note the production URL `*.vercel.app`.
4. **Hostinger domain → Vercel**
   - In Vercel: **Project → Settings → Domains** → add `yourdomain.com` and `www.yourdomain.com`.
   - Vercel shows required DNS records (usually **A** `76.76.21.21` for apex and **CNAME** `cname.vercel-dns.com` for `www`, or ALIAS/ANAME depending on DNS host).
   - In Hostinger **hPanel → Domains → DNS / Nameservers**: either point nameservers to Vercel **or** keep Hostinger DNS and add the A/CNAME records Vercel lists.
5. Wait for DNS propagation; Vercel will issue TLS automatically.
6. Set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` in Vercel env for Stripe return URLs.

> The app is built for **Vercel** (serverless + edge-friendly). Hostinger is used as the **registrar/DNS** home for your custom domain; you typically do **not** need Hostinger shared hosting for the Next.js app itself.

## Optional: Python

Add auxiliary tooling (image processing, automation) under e.g. `tools/` with its own `requirements.txt` when needed — not required for the web app.

## Figma

Design file: [Raivis_WebDev](https://www.figma.com/design/mA5PjhRF4kF26CgeHTNfNt/Raivis_WebDev). Re-export assets if Figma Dev Mode localhost image URLs are unavailable outside the desktop plugin.
