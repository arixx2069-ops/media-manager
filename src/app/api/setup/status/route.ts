import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    sitePassword: !!process.env.SITE_PASSWORD,
    authSecret: !!process.env.AUTH_SECRET,
    appUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    demoMode: process.env.DEMO_MODE === "false",
    metaAppId: !!process.env.META_APP_ID,
    metaAppSecret: !!process.env.META_APP_SECRET,
    tiktokClientKey: !!process.env.TIKTOK_CLIENT_KEY,
    tiktokClientSecret: !!process.env.TIKTOK_CLIENT_SECRET,
  };

  const allReady = Object.values(checks).every(Boolean);

  return NextResponse.json({
    checks,
    allReady,
    demoMode: process.env.DEMO_MODE !== "false",
  });
}
