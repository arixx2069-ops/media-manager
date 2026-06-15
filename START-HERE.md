# Start here — GitHub + deploy (beginner guide)

You need **2 free accounts**:

1. **GitHub** — stores your code online  
2. **Netlify** or **Cloudflare Pages** — runs the website (no credit card)

> **Render asks for a card even on Free** — skip Render. See **[DEPLOY-NO-CARD.md](./DEPLOY-NO-CARD.md)**.

Password for your site: **`aeen-iq`**

For **Instagram, Facebook, and TikTok live stats**, see **[API-SETUP.md](./API-SETUP.md)**.

The app supports **Arabic (العربية)** and **light mode** from the sidebar toggles.

---

## Part 1 — GitHub (put code online)

### Step 1: Make a GitHub account

1. Open **[github.com/signup](https://github.com/signup)**
2. Email + password + username (remember your **username**)
3. Finish sign-up (email verify if asked)

### Step 2: Create an empty repo

1. Open **[github.com/new](https://github.com/new)**
2. **Repository name:** `aeen-iq-social-manager`
3. Pick **Public**
4. **Do NOT** tick “Add a README”
5. Click **Create repository**

### Step 3: Upload your files (easiest — no terminal)

1. On the new repo page, click **“uploading an existing file”**
2. Open folder on your PC: `/home/arixx/Socialmngmnt`
3. **Drag ALL files and folders** into GitHub **EXCEPT:**
   - `node_modules` (huge — skip it)
   - `.next` (skip if you see it)
   - `.env` (private — skip it)
4. Scroll down → **Commit changes**

✅ Your code is on GitHub.

---

## Part 2 — Netlify (publish the website, no card)

### Step 1: Netlify account

1. Open **[app.netlify.com](https://app.netlify.com)**
2. **Sign up with GitHub** (same account as Part 1)
3. No credit card needed for the free plan

### Step 2: Import your repo

1. Click **Add new site** → **Import an existing project**
2. **Deploy with GitHub** → authorize → pick **`aeen-iq-social-manager`**

### Step 3: Build settings

| Field | Value |
|-------|--------|
| **Branch** | `main` |
| **Build command** | `npm install && npx prisma generate && npm run build` |

(Netlify usually auto-detects Next.js.)

### Step 4: Environment variables

Before deploy, open **Add environment variables** and add:

| Key | Value |
|-----|--------|
| `SITE_PASSWORD` | `aeen-iq` |
| `DEMO_MODE` | `true` |
| `AUTH_SECRET` | `my-secret-aeen-iq-2024-change-me` |

**Important:** All 3 must be set or login **`aeen-iq`** will not work.

### Step 5: Deploy

1. Click **Deploy site**
2. Wait **5–15 minutes**
3. Netlify gives a URL like **`https://random-name.netlify.app`**
4. Optional: **Site configuration** → **Domain management** → change site name to `aeen-iq-social-manager`

Open the link in **Firefox** (**https://**). Password: **`aeen-iq`**

### After deploy — use the app

1. Log in with **`aeen-iq`**
2. Sidebar → **My accounts** → add your real Instagram / TikTok username
3. Click **Visit** to open the profile in a new tab
4. Enter follower/like counts manually (until API keys are added)

---

## If login fails on Netlify

1. **Site configuration → Environment variables** — confirm `SITE_PASSWORD` = `aeen-iq` and `AUTH_SECRET` is set
2. **Deploys → Trigger deploy** (redeploy)
3. Clear site cookies in Firefox and try again

---

## If Netlify build failed

1. **Deploy log** → copy the red error
2. Build command must be: `npm run build` (not `next export`)
3. Re-upload latest code from your PC to GitHub, then redeploy

---

## If Netlify also asks for a card

Use **Cloudflare Pages** or a **free tunnel** — full steps in **[DEPLOY-NO-CARD.md](./DEPLOY-NO-CARD.md)**.

---

## Part 3 — Update code later

After you change files on your PC:

**Option A — Upload again on GitHub** (same drag-and-drop, or edit files in browser)

**Option B — Terminal** (if you learn git later):

```bash
cd /home/arixx/Socialmngmnt
git add .
git commit -m "update"
git push
```

Render redeploys automatically when GitHub updates.

---

## Quick test on your PC (no Render)

```bash
cd /home/arixx/Socialmngmnt
export FNM_DIR="$HOME/.local/share/fnm" && eval "$("$FNM_DIR"/fnm env)"
npm run dev
```

Open **http://localhost:3000** (not https) — password **`aeen-iq`**
