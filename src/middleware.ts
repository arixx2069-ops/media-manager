import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, isAuthRequired, isValidSession } from "@/lib/auth";

const PUBLIC_PATHS = [
  "/login",
  "/api/auth",
  "/api/oauth/meta/callback",
  "/api/oauth/tiktok/callback",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAuthRequired()) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  const session = request.cookies.get(AUTH_COOKIE)?.value;
  const authed = isValidSession(session);

  if (pathname === "/login" && authed) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPublicPath(pathname) || isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  if (authed) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = new URL("/login", request.url);
  if (pathname !== "/") {
    login.searchParams.set("from", pathname);
  }
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
