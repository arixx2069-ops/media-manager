# SMM — Full Bug Test Checklist

Test every button and action below. Mark with ✅ (pass), ❌ (fail), or ⚠️ (partial).

---

## 1. Login (`/login`)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 1.1 | Enter correct password (`aeen-iq`) → redirects to dashboard | | |
| 1.2 | Enter wrong password → shows error message | | |
| 1.3 | Submit with empty password field (shouldn't submit, HTML `required`) | | |
| 1.4 | Click "Enter" while loading → button disabled, shows "Checking…" | | |
| 1.5 | `?from=/accounts` redirect → goes to /accounts after login | | |

---

## 2. Dashboard (`/`)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 2.1 | Loading state shows "Updating stats from APIs…" | | |
| 2.2 | Stat cards render: Followers, Likes, Comments, Shares | | |
| 2.3 | Stat card values update numerically (check comma formatting) | | |
| 2.4 | "Your accounts" section shows connected accounts | | |
| 2.5 | **"Sync from APIs"** button click → spinner animation | | |
| 2.6 | Sync succeeds → green success message "Stats updated from…" | | |
| 2.7 | Sync fails → red error message "Could not sync…" | | |
| 2.8 | Sync message auto-hides after 5 seconds | | |
| 2.9 | **"Visit"** button per account → opens correct URL in new tab | | |
| 2.10 | Empty state (no accounts): shows "No accounts connected yet" | | |
| 2.11 | **"Add your first account"** button → navigates to /accounts | | |
| 2.12 | "Set META_* and TIKTOK_* keys" hint text visible at bottom | | |

---

## 3. Accounts (`/accounts`)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 3.1 | **"Connect Instagram & Facebook"** button → redirects to `/api/oauth/meta` | | |
| 3.2 | **"Connect TikTok"** button → redirects to `/api/oauth/tiktok` | | |
| 3.3 | Both buttons show "Connecting…" while loading | | |
| 3.4 | After Meta OAuth callback → URL param `?connected=meta` shows green dot | | |
| 3.5 | After TikTok OAuth callback → URL param `?connected=tiktok` shows green dot | | |
| 3.6 | **"Disconnect"** button (when connected) → removes connection, state updates | | |
| 3.7 | Platform `<select>` — can choose Instagram / Facebook / TikTok | | |
| 3.8 | Username `<input>` — enter text, field required check | | |
| 3.9 | Display name `<input>` — optional, leave empty | | |
| 3.10 | **"Add account"** submit button → account appears in list | | |
| 3.11 | **"Sync live stats"** per account → spinner, stats update | | |
| 3.12 | **"Visit"** per account → opens correct URL in new tab | | |
| 3.13 | Empty state: "No accounts yet" message displayed | | |
| 3.14 | Add account form clears after submit | | |

---

## 4. Comments (`/comments`)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 4.1 | Loading state shows "Loading comments…" | | |
| 4.2 | Comments render: platform badge, username, text, timestamp, likes | | |
| 4.3 | Empty state: "No positive comments found yet" | | |
| 4.4 | Long comment text wraps correctly | | |

---

## 5. AI Advisor (`/advisor`)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 5.1 | **"Clear chat"** button appears only when messages exist | | |
| 5.2 | Clear chat → all messages gone, localStorage cleared | | |
| 5.3 | Example prompt buttons (4 of them) → fill input field with text | | |
| 5.4 | Type question in `<textarea>` → text appears | | |
| 5.5 | **Send** button disabled when input empty or while thinking | | |
| 5.6 | **Enter** key sends message (not Shift+Enter) | | |
| 5.7 | **Shift+Enter** creates new line (doesn't send) | | |
| 5.8 | Thinking state shows "Thinking…" bubble | | |
| 5.9 | AI reply renders in chat | | |
| 5.10 | Chat auto-scrolls to latest message | | |
| 5.11 | Chat persists in localStorage across page refreshes | | |
| 5.12 | Provider indicator text updates correctly (groq/demo/none) | | |
| 5.13 | Error state shows "Something went wrong" | | |

---

## 6. Access Control (`/admin/access`)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 6.1 | Name `<input>` — empty prevents submit (required) | | |
| 6.2 | Platform `<select>` — choose All / Instagram / Facebook / TikTok | | |
| 6.3 | Role `<select>` — choose Viewer / Editor / Admin | | |
| 6.4 | **"Add"** submit button → entry appears in list | | |
| 6.5 | Entry shows: name, platform, role | | |
| 6.6 | **Delete (Trash)** button → removes entry, list updates | | |
| 6.7 | "Users (N)" count updates after add/delete | | |

---

## 7. Setup (`/setup`)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 7.1 | Status loads from API → 8 checks display | | |
| 7.2 | ✅ green check for passing, ❌ red X for failing | | |
| 7.3 | "Server looks ready" shows when all pass | | |
| 7.4 | **"Meta Developers"** link → opens in new tab | | |
| 7.5 | **"TikTok Developers"** link → opens in new tab | | |
| 7.6 | OAuth redirect URIs display correctly (current origin) | | |
| 7.7 | Environment variables table renders all rows | | |

---

## 8. Sidebar / Navigation

| # | Test | Result | Notes |
|---|------|--------|-------|
| 8.1 | **Dashboard** link → `/` active state | | |
| 8.2 | **AI Advisor** link → `/advisor` active state, accent color | | |
| 8.3 | **My accounts** link → `/accounts` | | |
| 8.4 | **Positive Comments** link → `/comments` | | |
| 8.5 | **API setup** link → `/setup` | | |
| 8.6 | **Install app** link → `/install` | | |
| 8.7 | **Access Control** link → `/admin/access` | | |
| 8.8 | Active nav item has `nav-active` class / bold | | |
| 8.9 | **Close (X)** button on mobile sidebar → closes sidebar | | |
| 8.10 | Backdrop overlay click → closes sidebar (mobile) | | |
| 8.11 | Sidebar close on route change (mobile) | | |
| 8.12 | Scroll lock when sidebar open (mobile) | | |

---

## 9. Bottom Navigation (mobile, < lg)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 9.1 | **Dashboard** icon/label → `/` | | |
| 9.2 | **AI Advisor** icon/label → `/advisor` | | |
| 9.3 | **My accounts** icon/label → `/accounts` | | |
| 9.4 | **Positive Comments** icon/label → `/comments` | | |
| 9.5 | **"More"** button → opens sidebar | | |
| 9.6 | Active tab highlighted with accent color | | |

---

## 10. Theme Toggle (sidebar)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 10.1 | **Light** button → sets light theme, button highlighted | | |
| 10.2 | **Dark** button → sets dark theme, button highlighted | | |
| 10.3 | Theme persists on page reload (localStorage) | | |
| 10.4 | All cards/text readable in both themes | | |

---

## 11. Language Toggle (sidebar)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 11.1 | **English (EN)** → all text in English | | |
| 11.2 | **العربية (AR)** → all text in Arabic, RTL layout | | |
| 11.3 | Language persists on reload (localStorage) | | |
| 11.4 | Nav labels, buttons, hints all translate | | |

---

## 12. Logout

| # | Test | Result | Notes |
|---|------|--------|-------|
| 12.1 | **"Log out"** button → POST `/api/auth/logout` | | |
| 12.2 | After logout → redirected to `/login` | | |
| 12.3 | Accessing any page after logout → redirected to login | | |

---

## 13. Install App (`/install` + sidebar)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 13.1 | **"Install app"** sidebar button → triggers install prompt or shows guide | | |
| 13.2 | "Install now" text when `beforeinstallprompt` fired | | |
| 13.3 | "App is installed" when already installed | | |
| 13.4 | **Install guide modal** opens when no native prompt | | |
| 13.5 | Install guide shows browser-specific steps (Firefox/Chrome/Safari) | | |
| 13.6 | **Close (X)** on guide modal → closes | | |
| 13.7 | **"Got it"** button on guide modal → closes | | |
| 13.8 | `/install` page renders the InstallButton in page variant | | |
| 13.9 | Meta refresh / redirect from `/google-play` to `/install` | | |

---

## 14. Quick Access Grid (if present)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 14.1 | Quick actions render on dashboard (if implemented) | | |

---

## 15. Mobile Header

| # | Test | Result | Notes |
|---|------|--------|-------|
| 15.1 | **Menu (hamburger)** button → opens sidebar | | |
| 15.2 | App name (SMM) + tagline displayed | | |

---

## 16. "Post for All" (New Feature)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 16.1 | **Sidebar "Post for all"** nav link → `/post` | | |
| 16.2 | **Bottom nav "Post"** (mobile) → `/post` | | |
| 16.3 | Page renders video upload area | | |
| 16.4 | File input accepts video files (.mp4, .mov, etc.) | | |
| 16.5 | Caption/description textarea accepts input | | |
| 16.6 | Platform checkboxes: Instagram, TikTok, Facebook | | |
| 16.7 | **"Post for all"** submit button → disabled when no video/no platforms | | |
| 16.8 | Posting state shows loading/spinner | | |
| 16.9 | Success message: "Posted to [platforms]" | | |
| 16.10 | Error message if post fails | | |
| 16.11 | Form resets after successful post | | |

---

## Summary

| Section | Total Tests | ✅ Pass | ❌ Fail | ⚠️ Partial |
|---------|-------------|---------|---------|------------|
| 1. Login | 5 | | | |
| 2. Dashboard | 12 | | | |
| 3. Accounts | 14 | | | |
| 4. Comments | 4 | | | |
| 5. AI Advisor | 13 | | | |
| 6. Access Control | 7 | | | |
| 7. Setup | 7 | | | |
| 8. Sidebar | 12 | | | |
| 9. Bottom Nav | 6 | | | |
| 10. Theme | 4 | | | |
| 11. Language | 4 | | | |
| 12. Logout | 3 | | | |
| 13. Install App | 9 | | | |
| 14. Quick Access | 1 | | | |
| 15. Mobile Header | 2 | | | |
| 16. Post for All | 11 | | | |
| **Total** | **114** | | | |
