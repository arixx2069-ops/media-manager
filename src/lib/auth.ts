export const AUTH_COOKIE = "aeen_iq_auth";

export function getSitePassword(): string {
  return process.env.SITE_PASSWORD ?? "aeen-iq";
}

export function getAuthSecret(): string {
  return process.env.AUTH_SECRET ?? "aeen-iq-social-manager-secret";
}

/** Pure JS hash — works on Edge middleware and Node (no crypto module). */
function hashToken(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return `v1_${(hash >>> 0).toString(16)}`;
}

export function createSessionToken(): string {
  return hashToken(`${getSitePassword()}:${getAuthSecret()}`);
}

export function verifyPassword(password: string): boolean {
  return password === getSitePassword();
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  return cookieValue === createSessionToken();
}

/** On by default. Set REQUIRE_AUTH=false to skip the login screen. */
export function isAuthRequired(): boolean {
  return process.env.REQUIRE_AUTH !== "false";
}
