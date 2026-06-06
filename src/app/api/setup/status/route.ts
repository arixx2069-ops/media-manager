import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    demoMode: process.env.DEMO_MODE !== "false",
    hasSitePassword: Boolean(process.env.SITE_PASSWORD?.trim()),
    hasAuthSecret: Boolean(process.env.AUTH_SECRET?.trim()),
    hasAppUrl: Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim()),
    appUrl: process.env.NEXT_PUBLIC_APP_URL?.trim() || null,
    hasMetaAppId: Boolean(process.env.META_APP_ID?.trim()),
    hasMetaSecret: Boolean(process.env.META_APP_SECRET?.trim()),
    hasTikTokKey: Boolean(process.env.TIKTOK_CLIENT_KEY?.trim()),
    hasTikTokSecret: Boolean(process.env.TIKTOK_CLIENT_SECRET?.trim()),
  });
}
