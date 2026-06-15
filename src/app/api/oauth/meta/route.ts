import { NextResponse } from "next/server";
import { OAUTH_STATE_COOKIE, setSignedCookie } from "@/lib/oauth/cookies";
import { buildMetaAuthUrl } from "@/lib/oauth/meta-flow";

export async function GET(request: Request) {
  try {
    const state = crypto.randomUUID();
    await setSignedCookie(OAUTH_STATE_COOKIE, { state }, 600);
    const url = buildMetaAuthUrl(request, state);
    return NextResponse.redirect(url);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Meta OAuth failed";
    return NextResponse.redirect(
      new URL(`/accounts?error=${encodeURIComponent(message)}`, request.url)
    );
  }
}
