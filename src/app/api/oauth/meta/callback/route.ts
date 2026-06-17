import { NextResponse } from "next/server";
import {
  clearCookie,
  META_CONN_COOKIE,
  OAUTH_STATE_COOKIE,
  readSignedCookie,
  setSignedCookie,
} from "@/lib/oauth/cookies";
import { exchangeMetaCode } from "@/lib/oauth/meta-flow";
import { syncAll } from "@/lib/api-sync";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const entries = payload?.entry ?? [];

    if (entries.length > 0) {
      await syncAll();
    }

    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "ok" });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const MY_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN ?? "aeen-iq-verify";

  if (mode === "subscribe" && token === MY_VERIFY_TOKEN) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

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
    const connection = await exchangeMetaCode(request, code);
    await setSignedCookie(META_CONN_COOKIE, connection);
    return NextResponse.redirect(
      new URL("/accounts?connected=meta", request.url)
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Meta connection failed";
    return NextResponse.redirect(
      new URL(`/accounts?error=${encodeURIComponent(message)}`, request.url)
    );
  }
}
