import { NextResponse } from "next/server";

interface AccessEntry {
  id: string;
  name: string;
  platform: string;
  role: string;
  createdAt: string;
}

let accessList: AccessEntry[] = [];

export async function GET() {
  return NextResponse.json({ entries: accessList });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entry: AccessEntry = {
      id: `access-${Date.now()}`,
      name: body.name ?? "Unknown",
      platform: body.platform ?? "all",
      role: body.role ?? "viewer",
      createdAt: new Date().toISOString(),
    };
    accessList.push(entry);
    return NextResponse.json({ entry });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
