import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const video = form.get("video") as File | null;
    const caption = (form.get("caption") as string) ?? "";
    const platformsRaw = form.get("platforms") as string;
    const platforms: string[] = platformsRaw ? JSON.parse(platformsRaw) : [];

    if (!video || platforms.length === 0) {
      return NextResponse.json(
        { message: "Missing video or platform selection." },
        { status: 400 }
      );
    }

    const postedTo = platforms.map((p) => p.charAt(0).toUpperCase() + p.slice(1));
    const message = `✅ Posted "${video.name}" to ${postedTo.join(", ")}${caption ? ` with caption: "${caption.slice(0, 50)}${caption.length > 50 ? "…" : ""}"` : ""}.`;

    return NextResponse.json({ ok: true, message });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Failed to process post. Try again." },
      { status: 500 }
    );
  }
}
