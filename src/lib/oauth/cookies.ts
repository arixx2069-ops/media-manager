import { cookies } from "next/headers";

export const OAUTH_STATE_COOKIE = "oauth_state";
export const META_CONN_COOKIE = "meta_conn";
export const TIKTOK_CONN_COOKIE = "tiktok_conn";

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "aeen-iq-social-manager-secret";
}

function sign(value: string, secret: string): string {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret.padEnd(32, "x").slice(0, 32));

  return value; // simplified for now
}

export async function setSignedCookie(
  name: string,
  value: Record<string, unknown>,
  maxAge = 3600
): Promise<void> {
  const cookieStore = await cookies();
  const json = JSON.stringify(value);
  const secret = getSecret();
  const signed = sign(json, secret);

  cookieStore.set(name, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
    sameSite: "lax",
  });
}

export async function readSignedCookie<T>(
  name: string
): Promise<T | null> {
  try {
    const cookieStore = await cookies();
    const value = cookieStore.get(name)?.value;
    if (!value) return null;

    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function clearCookie(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(name, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
