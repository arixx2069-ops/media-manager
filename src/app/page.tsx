"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { PlatformBadge } from "@/components/platform-badge";
import type { Platform } from "@prisma/client";

type MetricsResponse = {
  platforms: {
    platform: Platform;
    likes: number;
    comments: number;
    shares: number;
    followers: number;
  }[];
  totals: { likes: number; comments: number; shares: number; followers: number };
};

export default function DashboardPage() {
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const totals = data?.totals;

  return (
    <div className="p-8 max-w-6xl">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-zinc-500 mt-1">
          Overview of engagement across connected platforms
        </p>
      </header>

      {loading ? (
        <p className="text-zinc-500">Loading metrics…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total likes" value={totals?.likes ?? 0} icon={Heart} />
            <StatCard
              label="Comments"
              value={totals?.comments ?? 0}
              icon={MessageCircle}
            />
            <StatCard label="Shares" value={totals?.shares ?? 0} icon={Share2} />
            <StatCard
              label="Followers"
              value={totals?.followers ?? 0}
              icon={Users}
            />
          </div>

          <section>
            <h3 className="text-lg font-medium mb-4">By platform</h3>
            <div className="grid gap-3">
              {data?.platforms.map((p) => (
                <div
                  key={p.platform}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-800 bg-[#12121a] p-4"
                >
                  <PlatformBadge platform={p.platform} />
                  <div className="flex gap-6 text-sm text-zinc-400 ml-auto">
                    <span>
                      <strong className="text-zinc-200">
                        {p.likes.toLocaleString()}
                      </strong>{" "}
                      likes
                    </span>
                    <span>
                      <strong className="text-zinc-200">
                        {p.comments.toLocaleString()}
                      </strong>{" "}
                      comments
                    </span>
                    <span>
                      <strong className="text-zinc-200">
                        {p.followers.toLocaleString()}
                      </strong>{" "}
                      followers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
