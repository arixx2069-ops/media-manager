#!/usr/bin/env bash
# Publish SocialMngmnt to a public HTTPS URL (Vercel free tier)
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -f "$HOME/.local/share/fnm/fnm" ]; then
  export FNM_DIR="$HOME/.local/share/fnm"
  eval "$("$FNM_DIR"/fnm env)"
fi

echo "==> Installing dependencies..."
npm install

echo ""
echo "==> Deploying to Vercel (build runs on Vercel servers)..."
echo "    First time: browser opens — log in with Google/GitHub/email."
echo ""
npx vercel deploy --prod --name aeen-iq-social-manager

echo ""
echo "Done. Copy the 'Production' URL above and share it with anyone."
