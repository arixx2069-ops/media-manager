import { cookies } from "next/headers";
import { getAuthSecret } from "@/lib/auth";

export const META_CONN_COOKIE = "aeen_meta_oauth";
export const TIKTOK_CONN_COOKIE = "aeen_tiktok_oauth";
export const OAUTH_STATE_COOKIE = "aeen_oauth_state";

function hash(input: string): string {
  const secret = getAuthSecret();
  let h = 5381;
  const s = `${secret}:${input}`;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return (h >>> 0).toString(16);
}

function sign(value: string): string {
  return `${value}.${hash(value)}`;
}

function verify(signed: string): string | null {
  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return null;
  const value = signed.slice(0, lastDot);
  const sig = signed.slice(lastDot + 1);
  if (sig !== hash(value)) return null;
  return value;
}

export async function setSignedCookie(
  name: string,
  data: object,
  maxAgeSeconds = 60 * 60 * 24 * 60
) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const jar = await cookies();
  jar.set(name, sign(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function readSignedCookie<T>(name: string): Promise<T | null> {
  const jar = await cookies();
  const raw = jar.get(name)?.value;
  if (!raw) return null;
  const payload = verify(raw);
  if (!payload) return null;
  try {
    return JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as T;
  } catch {
    return null;
  }
}

export async function clearCookie(name: string) {
  const jar = await cookies();
  jar.delete(name);
}
