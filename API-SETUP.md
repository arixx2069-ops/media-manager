# Official API setup — SMM Social Media Manager

This app reads **likes**, **followers** (subscribers), and **comments** from official APIs.

## Easiest: Connect buttons (recommended)

1. Set on your server (Netlify / `.env`):

```env
DEMO_MODE=false
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
META_APP_ID=...
META_APP_SECRET=...
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
```

2. In **Meta Developer** → your app → **Facebook Login** → **Valid OAuth Redirect URIs**, add:

- `https://your-site.netlify.app/api/oauth/meta/callback`

3. In **TikTok Developer** → your app → redirect URI:

- `https://your-site.netlify.app/api/oauth/tiktok/callback`

4. Open the app → **My accounts** → **Connect Instagram & Facebook** / **Connect TikTok**.

5. After login, stats sync **automatically** when you open the dashboard (or tap **Sync**).  
   This is not live streaming every second — it refreshes on page load and when you sync.

---

## Manual tokens (optional)

You can paste long-lived tokens in env instead of using Connect buttons. See sections below.

## 1. Meta (Instagram + Facebook)

1. Create an app at [developers.facebook.com](https://developers.facebook.com/).
2. Add products: **Instagram Graph API** and **Facebook Login** (for Page access).
3. Connect a **Facebook Page** and **Instagram Business/Creator** account in Meta Business Suite.
4. Generate a **long-lived Page access token** with permissions:
   - `instagram_basic`, `instagram_manage_insights` (Instagram)
   - `pages_read_engagement`, `pages_show_list` (Facebook Page)
5. Find IDs in [Graph API Explorer](https://developers.facebook.com/tools/explorer/):
   - `META_INSTAGRAM_ACCOUNT_ID` — Instagram Business account ID
   - `META_FACEBOOK_PAGE_ID` — Page ID (numeric)
6. Add to `.env` or Netlify environment variables:

```env
DEMO_MODE=false
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_ACCESS_TOKEN=your_page_access_token
META_INSTAGRAM_ACCOUNT_ID=178414...
META_FACEBOOK_PAGE_ID=123456789
```

7. In the app: add an **Instagram** and/or **Facebook** account on **My accounts**, then click **Sync live stats**.

Docs: [Instagram Graph API](https://developers.facebook.com/docs/instagram-api) · [Pages API](https://developers.facebook.com/docs/pages-api)

---

## 2. TikTok

1. Register at [developers.tiktok.com](https://developers.tiktok.com/).
2. Create an app and enable **Login Kit** + **Display API**.
3. Request scopes: `user.info.basic`, `user.info.stats`, `video.list` (app review may be required).
4. Complete OAuth to obtain a **user access token** for your TikTok account.

```env
DEMO_MODE=false
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_ACCESS_TOKEN=your_user_access_token
```

5. Add a **TikTok** account in the app and use **Sync live stats**.

Docs: [Display API – User Info](https://developers.tiktok.com/doc/display-api-get-user-info)

---

## 3. Arabic + light mode

- Use the sidebar toggles: **فاتح / Light** theme and **العربية / English** language.
- Arabic enables RTL layout automatically.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Sync does nothing | Ensure `DEMO_MODE=false` and all `META_*` / `TIKTOK_*` vars are set on the **server** (Netlify env), not only locally. |
| Meta token expired | Regenerate long-lived token in Meta Business Suite. |
| TikTok 403 | App still in sandbox — submit for review or use test users. |
| Comments empty on TikTok | Comment API needs extra scopes; Instagram/Facebook comments work when media permissions are granted. |
