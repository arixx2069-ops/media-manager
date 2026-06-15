import { NextResponse } from "next/server";
import { isDemoMode, hasMetaCredentials, hasTikTokCredentials, getMetaCredentials, getTikTokCredentials } from "@/lib/oauth/credentials";

export async function GET() {
  const demo = isDemoMode();

  return NextResponse.json({
    demoMode: demo,
    meta: {
      configured: hasMetaCredentials(),
      hasToken: !!getMetaCredentials(),
    },
    tiktok: {
      configured: hasTikTokCredentials(),
      hasToken: !!getTikTokCredentials(),
    },
    env: {
      hasSitePassword: !!process.env.SITE_PASSWORD,
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    },
  });
}
