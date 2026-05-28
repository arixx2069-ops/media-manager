import { DEMO_PLATFORMS } from "@/lib/demo-data";
import { PlatformBadge } from "@/components/platform-badge";
import Link from "next/link";

export default function PlatformsPage() {
  return (
    <div className="p-8 max-w-3xl">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold">Platforms</h2>
        <p className="text-zinc-500 mt-1">
          Connect official APIs for live data. Copy{" "}
          <code className="text-indigo-300">.env.example</code> to{" "}
          <code className="text-indigo-300">.env</code> and add your keys.
        </p>
      </header>

      <ul className="space-y-4">
        {DEMO_PLATFORMS.map((p) => (
          <li
            key={p.platform}
            className="rounded-xl border border-zinc-800 bg-[#12121a] p-4 flex items-center gap-4"
          >
            <PlatformBadge platform={p.platform} />
            <div className="flex-1">
              <p className="font-medium">{p.accountName}</p>
              <p className="text-sm text-green-400/90">Connected (demo)</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 text-sm text-zinc-400">
        <p className="font-medium text-zinc-200 mb-2">Production setup</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Instagram / Facebook — Meta Graph API (Business account)</li>
          <li>TikTok — TikTok for Developers (Marketing / Display API)</li>
          <li>Telegram — Bot token from @BotFather</li>
          <li>YouTube — Google Cloud OAuth + YouTube Data API v3</li>
        </ul>
        <Link
          href="/google-play"
          className="inline-block mt-3 text-indigo-400 hover:text-indigo-300"
        >
          → Publish on Google Play
        </Link>
      </div>
    </div>
  );
}
