# Aeen-iq.Social-manager

A unified dashboard to track engagement (likes, comments, followers) across **Instagram**, **TikTok**, **Telegram**, **YouTube**, and more. Includes team access management, positive-comment highlights, an **AI Advisor** for content strategy, and a path to publish on **Google Play**.

## Features

| Feature | Status |
|--------|--------|
| Multi-platform metrics dashboard | ✅ Demo + adapter architecture |
| Positive comments feed | ✅ Demo data; live via platform APIs |
| Add / remove platform users | ✅ API + UI |
| AI Advisor (what to post & do) | ✅ Demo; OpenAI when configured |
| Google Play (TWA / Capacitor guide) | ✅ In-app `/google-play` page |

## Public URL (share with everyone)

The app is **not online yet** until you deploy once (free).

**In Iraq?** Vercel SMS often fails — use **[DEPLOY-IRAQ.md](./DEPLOY-IRAQ.md)** (Render / Netlify / Cloudflare with GitHub, no phone).

**Elsewhere — Vercel:** see [DEPLOY.md](./DEPLOY.md).

Login password for everyone: **`aeen-iq`**

---

## Quick start (local only)

```bash
cd Socialmngmnt
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — only works on your computer until you deploy.

**Login password:** `aeen-iq` (change via `SITE_PASSWORD` in `.env`).

**Demo mode** is on by default (`DEMO_MODE=true`). No API keys required for a manager demo.

## Going live (real platform data)

Each network requires **official APIs** and business/developer approval. You cannot legally scrape likes or manage users without OAuth tokens.

| Platform | What you need |
|----------|----------------|
| Instagram / Facebook | [Meta for Developers](https://developers.facebook.com/) — Graph API, Business/Creator account |
| TikTok | [TikTok for Developers](https://developers.tiktok.com/) — app review for Marketing API |
| Telegram | [@BotFather](https://t.me/BotFather) bot token — channel/group admin |
| YouTube | Google Cloud project + YouTube Data API v3 OAuth |

Set `DEMO_MODE=false` in `.env` and fill in keys from `.env.example`.

### AI Advisor

Set `OPENAI_API_KEY` and `DEMO_MODE=false` for live GPT-based recommendations.

## Install in Firefox or Chrome (PWA)

Works as a normal website in any browser, and can be **installed** in both **Firefox** and **Chrome**:

| Browser | How to install |
|---------|----------------|
| **Firefox** | ☰ menu → **Install…** / **Install this site as an app** (desktop); **Add to Home screen** (mobile) |
| **Chrome** | Address bar install icon, sidebar button, or **⋮ → Install app** |

1. Run or deploy over **HTTPS** (or `localhost` for dev).
2. Open the URL in Firefox or Chrome.
3. Follow steps in the sidebar **Install app** page (`/install`).

No Play Store required. Same link works for everyone — each person picks their browser.

## Project structure

```
src/
  app/           # Pages + API routes
  components/    # UI
  lib/
    platforms/   # Per-network adapters (demo + Telegram stub)
    ai-advisor.ts
    demo-data.ts
prisma/          # SQLite schema (upgrade to PostgreSQL for production)
```

## Important limitations

- **Add/remove users on Instagram/TikTok** in production means managing **your team’s access** or **collaborator roles** via each platform’s official tools—not arbitrary third-party accounts without permission.
- Store policies require privacy policies, data handling disclosures, and compliant use of each API’s terms of service.
- Budget time for Meta/TikTok **app review** before production launch.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:push` | Apply Prisma schema to SQLite |

## License

Private / internal — confirm with your organization before public distribution.
