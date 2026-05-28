import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USERS } from "@/lib/demo-data";
import type { Platform } from "@prisma/client";

const usersStore = [...DEMO_USERS];

const addSchema = z.object({
  platform: z.enum([
    "INSTAGRAM",
    "TIKTOK",
    "TELEGRAM",
    "YOUTUBE",
    "TWITTER",
    "FACEBOOK",
    "LINKEDIN",
  ]),
  username: z.string().min(1),
  displayName: z.string().optional(),
  role: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({ users: usersStore });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = addSchema.parse(body);
    const exists = usersStore.some(
      (u) => u.platform === data.platform && u.username === data.username
    );
    if (exists) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }
    usersStore.push({
      platform: data.platform as Platform,
      username: data.username,
      displayName: data.displayName ?? data.username,
      role: data.role ?? "member",
      isActive: true,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const platform = request.nextUrl.searchParams.get("platform");
  const username = request.nextUrl.searchParams.get("username");
  if (!platform || !username) {
    return NextResponse.json({ error: "platform and username required" }, { status: 400 });
  }
  const idx = usersStore.findIndex(
    (u) => u.platform === platform && u.username === username
  );
  if (idx === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  usersStore.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
