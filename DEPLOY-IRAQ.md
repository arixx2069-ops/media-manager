# Deploy from Iraq (no Vercel SMS)

Vercel often requires **SMS verification** that is **not available in Iraq**. Use one of these instead — all support **GitHub sign-up** (no phone).

Your app name: **Aeen-iq.Social-manager**  
Password after deploy: **`aeen-iq`**

---

## Option 1 — Render (recommended)

1. Put your code on **GitHub**:
   - Go to [github.com/new](https://github.com/new) → create repo `aeen-iq-social-manager`
   - Upload the project folder, or in terminal:
     ```bash
     cd /home/arixx/Socialmngmnt
     git remote add origin https://github.com/YOUR_USERNAME/aeen-iq-social-manager.git
     git push -u origin main
     ```
2. Open **[render.com](https://render.com)** → **Get Started** → **Sign in with GitHub**
3. **New +** → **Web Service** → connect your GitHub repo
4. Settings:
   - **Name:** `aeen-iq-social-manager`
   - **Build command:** `npm install && npx prisma generate && npm run build`
   - **Start command:** `npm start`
   - **Instance type:** Free
5. **Environment** → add:
   | Key | Value |
   |-----|--------|
   | `SITE_PASSWORD` | `aeen-iq` |
   | `DEMO_MODE` | `true` |
   | `AUTH_SECRET` | any long random string |
6. **Create Web Service** — wait ~5–10 minutes.

Your URL will look like:  
**`https://aeen-iq-social-manager.onrender.com`**

> Free Render apps sleep after ~15 min idle; first visit may take 30–60 seconds to wake up.

---

## Option 2 — Netlify

1. Code on GitHub (same as above).
2. **[app.netlify.com](https://app.netlify.com)** → **Sign up with GitHub**
3. **Add new site** → **Import from GitHub** → pick your repo
4. Build settings (usually auto-detected):
   - Build: `npm install && npx prisma generate && npm run build`
   - Plugin: Next.js (Netlify adds `@netlify/plugin-nextjs`)
5. **Site configuration → Environment variables:**
   - `SITE_PASSWORD` = `aeen-iq`
   - `DEMO_MODE` = `true`
   - `AUTH_SECRET` = random string
6. Deploy.

URL: **`https://something.netlify.app`** (rename site in Netlify to `aeen-iq-social-manager` if you want a closer name).

---

## Option 3 — Cloudflare Pages

1. **[dash.cloudflare.com](https://dash.cloudflare.com)** → sign up with **email** (often works without SMS)
2. **Workers & Pages** → **Create** → **Pages** → connect GitHub
3. Framework: **Next.js** — set env vars same as above.

URL: **`https://aeen-iq-social-manager.pages.dev`**

---

## Option 4 — Stay local (no hosting)

Only you can use it on your PC:

```bash
cd /home/arixx/Socialmngmnt
export FNM_DIR="$HOME/.local/share/fnm" && eval "$("$FNM_DIR"/fnm env)"
npm run dev
```

Open **http://localhost:3000** — password **`aeen-iq`**.

To show your manager on the same Wi‑Fi, use your PC’s local IP (e.g. `http://192.168.1.5:3000`) — not public internet.

---

## Do NOT use for Iraq

| Service | Problem |
|---------|---------|
| **Vercel** | SMS verification not enabled in Iraq |
| Random “free SMS” sites | Unsafe; won’t fix Vercel country check |

---

## After deploy

- Share the **https://** link with your team
- They open it in **Firefox** or **Chrome**
- Login password: **`aeen-iq`**
- Install: browser menu → Install app / Add to Home screen
