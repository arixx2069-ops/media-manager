import { NextResponse } from "next/server";
import {
  isMetaConfigured,
  isTikTokConfigured,
  resolveCredentials,
} from "@/lib/oauth/credentials";

export async function GET() {
  const creds = await resolveCredentials();

  return NextResponse.json({
    meta: {
      connected: isMetaConfigured(creds),
      instagram: creds.meta?.igAccountId
        ? {
            username: creds.meta.igUsername ?? "instagram",
            accountId: creds.meta.igAccountId,
          }
        : null,
      facebook: creds.meta?.pageId
        ? {
            name: creds.meta.pageName ?? "facebook",
            pageId: creds.meta.pageId,
          }
        : null,
    },
    tiktok: {
      connected: isTikTokConfigured(creds),
      username: creds.tiktok?.username ?? null,
      displayName: creds.tiktok?.displayName ?? null,
    },
  });
}
