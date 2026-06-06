import { NextResponse } from "next/server";
import {
  clearCookie,
  META_CONN_COOKIE,
  OAUTH_STATE_COOKIE,
  readSignedCookie,
  setSignedCookie,
} from "@/lib/oauth/cookies";
import { exchangeMetaCode } from "@/lib/oauth/meta-flow";

const META_VERIFY_TOKEN = "aeen-iq-126-secret";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === META_VERIFY_TOKEN) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const errorReason = searchParams.get("error_reason");

  if (error || errorDescription) {
    const errorMessage = errorDescription || errorReason || error || "Meta OAuth failed";
    console.error("Meta OAuth error:", { error, errorDescription, errorReason });
    return NextResponse.redirect(
      new URL(`/accounts?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }

  const code = searchParams.get("code");
  const accessToken = searchParams.get("access_token");
  const state = searchParams.get("state");

  const saved = await readSignedCookie<{ state: string }>(OAUTH_STATE_COOKIE);
  await clearCookie(OAUTH_STATE_COOKIE);

  if (!state || !saved?.state || state !== saved.state) {
    console.error("Meta OAuth state mismatch:", { received: state, saved: saved?.state });
    return NextResponse.redirect(
      new URL("/accounts?error=Invalid+OAuth+state+or+session+expired", request.url)
    );
  }

  if (code) {
    try {
      const connection = await exchangeMetaCode(request, code);
      await setSignedCookie(META_CONN_COOKIE, connection);
      return NextResponse.redirect(new URL("/accounts?connected=meta", request.url));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Meta connection failed";
      console.error("Meta OAuth exchange error:", e);
      return NextResponse.redirect(
        new URL(`/accounts?error=${encodeURIComponent(message)}`, request.url)
      );
    }
  }

  if (accessToken) {
    try {
      const connection = await exchangeMetaCode(request, accessToken);
      await setSignedCookie(META_CONN_COOKIE, connection);
      return NextResponse.redirect(new URL("/accounts?connected=meta", request.url));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Meta connection failed";
      console.error("Meta OAuth implicit flow error:", e);
      return NextResponse.redirect(
        new URL(`/accounts?error=${encodeURIComponent(message)}`, request.url)
      );
    }
  }

  return NextResponse.redirect(
    new URL("/accounts?error=No+authorization+code+or+access+token+received", request.url)
  );
}
