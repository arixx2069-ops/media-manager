import { createHash } from "crypto";

export const AUTH_COOKIE = "aeen_iq_auth";

export function getSitePassword(): string {
  return process.env.SITE_PASSWORD ?? "aeen-iq";
}

function getAuthSecret(): string {
  return process.env.AUTH_SECRET ?? "aeen-iq-social-manager-secret";
}

export function createSessionToken(): string {
  return createHash("sha256")
    .update(`${getSitePassword()}:${getAuthSecret()}`)
    .digest("hex");
}

export function verifyPassword(password: string): boolean {
  return password === getSitePassword();
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  return cookieValue === createSessionToken();
}
