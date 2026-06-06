import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, createSessionToken, verifyPassword } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    if (email) {
      const accessUser = await prisma.accessControl.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (accessUser && accessUser.status !== "approved") {
        if (accessUser.status === "pending") {
          return NextResponse.json(
            { error: "Your access request is pending approval" },
            { status: 403 }
          );
        }
        if (accessUser.status === "denied") {
          return NextResponse.json(
            { error: "Your access has been denied" },
            { status: 403 }
          );
        }
      }
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
