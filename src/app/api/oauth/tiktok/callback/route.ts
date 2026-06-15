import { NextResponse } from "next/server";
import {
  clearCookie,
  OAUTH_STATE_COOKIE,
  readSignedCookie,
  setSignedCookie,
  TIKTOK_CONN_COOKIE,
} from "@/lib/oauth/cookies";
import { exchangeTikTokCode } from "@/lib/oauth/tiktok-flow";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const error = searchParams.get("error_description") ?? searchParams.get("error");
  if (error) {
    return NextResponse.redirect(
      new URL(`/accounts?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const saved = await readSignedCookie<{ state: string }>(OAUTH_STATE_COOKIE);
  await clearCookie(OAUTH_STATE_COOKIE);

  if (!code || !state || !saved?.state || state !== saved.state) {
    return NextResponse.redirect(
      new URL("/accounts?error=Invalid+OAuth+state", request.url)
    );
  }

  try {
    const connection = await exchangeTikTokCode(request, code);
    await setSignedCookie(TIKTOK_CONN_COOKIE, connection);
    return NextResponse.redirect(
      new URL("/accounts?connected=tiktok", request.url)
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "TikTok connection failed";
    return NextResponse.redirect(
      new URL(`/accounts?error=${encodeURIComponent(message)}`, request.url)
    );
  }
}
