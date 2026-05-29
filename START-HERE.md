# Start here — GitHub + Render (beginner guide)

You need **2 free accounts** (no phone SMS on Render):

1. **GitHub** — stores your code online  
2. **Render** — runs the website 24/7  

Password for your site: **`aeen-iq`**

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

## Part 2 — Render (publish the website)

### Step 1: Render account

1. Open **[render.com](https://render.com)**
2. Click **Get Started** → **Sign in with GitHub**
3. Allow Render to see your GitHub

### Step 2: Create Web Service

1. Click **New +** (top right) → **Web Service**
2. Under **Connect a repository**, find **`aeen-iq-social-manager`** → **Connect**
3. If you don’t see it: **Configure account** → give Render access to that repo

### Step 3: Settings (copy exactly)

| Field | Value |
|-------|--------|
| **Name** | `aeen-iq-social-manager` |
| **Region** | Frankfurt (or closest to you) |
| **Branch** | `main` |
| **Runtime** | **Node** |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### Step 4: Environment variables

Click **Advanced** → **Add Environment Variable** — add these **3**:

| Key | Value |
|-----|--------|
| `SITE_PASSWORD` | `aeen-iq` |
| `DEMO_MODE` | `true` |
| `AUTH_SECRET` | `my-secret-aeen-iq-2024-change-me` |

### Step 5: Deploy

1. Click **Create Web Service**
2. Wait **5–15 minutes** (logs will scroll — wait until it says **Live**)
3. At the top you’ll see a link like:  
   **`https://aeen-iq-social-manager.onrender.com`**

Open that link in **Firefox** (use **https://**).  
Login password: **`aeen-iq`**

---

## If something fails on Render

1. Click your service → **Logs**
2. Common fixes:
   - Build failed → check Build Command is copied exactly
   - **Out of memory** on free plan → we can simplify the app later
3. First visit after idle: wait **60 seconds** and refresh (free tier sleeps)

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
