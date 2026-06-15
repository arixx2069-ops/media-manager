import { cookies } from "next/headers";

export const AUTH_COOKIE = "session";

export async function checkAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE)?.value;
    return session === "authenticated";
  } catch {
    return false;
  }
}

export async function login(password: string): Promise<boolean> {
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) return false;
  return password === sitePassword;
}
