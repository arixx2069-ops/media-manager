import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

// GET - List all access control users
export async function GET() {
  try {
    const users = await prisma.accessControl.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch access control users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST - Add new user to access control
export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.accessControl.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const user = await prisma.accessControl.create({
      data: {
        email,
        name: name || null,
        status: "pending",
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to create access control user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
