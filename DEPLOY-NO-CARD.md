# Deploy WITHOUT a credit card

Render (and Railway, Fly.io) often ask for a **card even on Free** — you can skip them.

---

## Option A — Netlify (best: no card, like Render)

1. Code on **GitHub** (see [START-HERE.md](./START-HERE.md) Part 1).
2. **[app.netlify.com](https://app.netlify.com)** → **Sign up with GitHub** (no card usually).
3. **Add new site** → **Import an existing project** → pick `aeen-iq-social-manager`.
4. Build settings:
   - **Build command:** `npm install && npx prisma generate && npm run build`
   - **Publish directory:** leave default (Netlify Next.js plugin sets this)
5. **Site configuration** → **Environment variables** → add:

   | Key | Value |
   |-----|--------|
   | `SITE_PASSWORD` | `aeen-iq` |
   | `DEMO_MODE` | `true` |
   | `AUTH_SECRET` | `aeen-iq-secret-12345` |

6. **Deploy site**.

URL: `https://YOUR-SITE-NAME.netlify.app`  
Password: **`aeen-iq`**

---

## Option B — Cloudflare Pages (no card)

1. **[dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)** — email only (no card for free plan).
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select GitHub repo `aeen-iq-social-manager`.
4. Framework preset: **Next.js** (or set build: `npm install && npx prisma generate && npm run build`).
5. **Environment variables** (same 3 as Netlify above).
6. **Save and Deploy**.

URL: `https://aeen-iq-social-manager.pages.dev` (or similar).

---

## Option C — Free public link from your PC (no hosting, no card)

Run the app on your laptop and get a **temporary public URL** with Cloudflare (free tool):

```bash
cd /home/arixx/Socialmngmnt
export FNM_DIR="$HOME/.local/share/fnm" && eval "$("$FNM_DIR"/fnm env)"

# Terminal 1 — start app
npm run dev

# Terminal 2 — install cloudflared once, then tunnel
# Linux:
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
./cloudflared tunnel --url http://localhost:3000
```

It prints a link like `https://something-random.trycloudflare.com` — share that.  
Password: **`aeen-iq`**

- **Pros:** No card, no GitHub deploy, works today.
- **Cons:** Link changes each time; PC must stay on and running.

---

## Option D — Only on your computer

```bash
npm run dev
```

Open **http://localhost:3000** — password **`aeen-iq`**.  
Nobody else can open it unless they’re on your Wi‑Fi and you use your PC’s IP.

---

## Do NOT use

| Service | Why |
|---------|-----|
| **Render / Railway / Fly** (if they ask for card) | You can’t finish without paying verification |
| **Fake/virtual cards** | Against terms; account ban |

---

## Summary

| Method | Card? | Always online? |
|--------|-------|----------------|
| **Netlify** | Usually no | Yes |
| **Cloudflare Pages** | No | Yes |
| **Cloudflare Tunnel** | No | Only while PC runs |
| **localhost** | No | Only you |

Try **Netlify** first after GitHub upload.
