# Deploy Aeen-iq.Social-manager (public URL)

Free hosting on **Vercel** — stays online 24/7 on the free plan.

**Target URL:** `https://aeen-iq-social-manager.vercel.app`  
(Set project name to `aeen-iq-social-manager` when deploying.)

**Login password:** `aeen-iq` (change `SITE_PASSWORD` in Vercel env vars for production.)

---

## Option A — Vercel website (easiest, ~5 minutes)

1. Push this folder to **GitHub** (create a repo, upload files, or `git push`).
2. Go to [https://vercel.com/new](https://vercel.com/new) and sign in with GitHub.
3. **Import** your `Socialmngmnt` repository.
4. Vercel detects Next.js automatically. Click **Deploy**.
5. Add environment variable (optional but recommended):
   - `DEMO_MODE` = `true`
6. When finished, you get a URL like:
   - `https://aeen-iq-social-manager.vercel.app`
   - `SITE_PASSWORD` = `aeen-iq` (or your own password)
   - Share that link — it stays live on the free plan.

Custom domain (optional): Project → Settings → Domains.

## Option B — Vercel CLI (from this machine)

```bash
export FNM_DIR="$HOME/.local/share/fnm" && eval "$("$FNM_DIR"/fnm env)"
cd /home/arixx/Socialmngmnt
npm install
npx vercel login
npx vercel --prod
```

Copy the **Production** URL from the terminal output.

## After deploy

- Open the URL in **Firefox** or **Chrome**
- Install: sidebar → **Install app**, or browser menu → Install / Add to Home screen
- PWA install requires **HTTPS** (Vercel provides this automatically)

## Notes

- Demo data works without API keys (`DEMO_MODE=true`).
- Free tier has fair-use limits; fine for team/manager demos.
- User add/remove in demo uses in-memory storage on serverless (resets on cold start). For persistent data, add a hosted database (e.g. Vercel Postgres) later.
