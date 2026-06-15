"use client";

import { useCallback, useState } from "react";

interface PlatformConnectProps {
  platform: "meta" | "tiktok";
  label: string;
  isConnected: boolean;
  onDisconnect: () => void;
}

export function PlatformConnect({
  platform,
  label,
  isConnected,
  onDisconnect,
}: PlatformConnectProps) {
  const [loading, setLoading] = useState(false);

  const handleConnect = useCallback(async () => {
    setLoading(true);
    try {
      window.location.href = `/api/oauth/${platform}`;
    } catch {
      setLoading(false);
    }
  }, [platform]);

  const handleDisconnect = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/api/oauth/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      onDisconnect();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [platform, onDisconnect]);

  if (isConnected) {
    return (
      <div className="flex items-center justify-between p-3 editorial-card">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--positive)]" />
          <span className="text-sm font-medium">{label}</span>
          <span className="text-[0.62rem] uppercase text-[var(--muted)] ml-1">
            Connected
          </span>
        </div>
        <button
          type="button"
          onClick={handleDisconnect}
          disabled={loading}
          className="text-xs text-[var(--muted)] hover:text-red-500 transition-colors"
        >
          {loading ? "..." : "Disconnect"}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleConnect}
      disabled={loading}
      className="btn-primary w-full"
    >
      {loading ? "Connecting\u2026" : label}
    </button>
  );
}
