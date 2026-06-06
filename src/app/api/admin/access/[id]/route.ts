import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

// PATCH - Update user status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const { id } = params;

    if (!status || !["pending", "approved", "denied"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const user = await prisma.accessControl.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to update access control user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE - Remove user from access control
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.accessControl.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete access control user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
