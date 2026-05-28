"use client";

import { useEffect, useState, FormEvent } from "react";
import { PlatformBadge } from "@/components/platform-badge";
import type { Platform } from "@prisma/client";
import { UserPlus, Trash2 } from "lucide-react";

type User = {
  platform: Platform;
  username: string;
  displayName?: string;
  role: string;
  isActive: boolean;
};

const PLATFORMS: Platform[] = ["INSTAGRAM", "TIKTOK", "TELEGRAM", "YOUTUBE"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState<Platform>("INSTAGRAM");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  const load = () =>
    fetch("/api/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, username, displayName: displayName || username }),
    });
    setUsername("");
    setDisplayName("");
    load();
  }

  async function handleRemove(p: Platform, u: string) {
    await fetch(`/api/users?platform=${p}&username=${encodeURIComponent(u)}`, {
      method: "DELETE",
    });
    load();
  }

  return (
    <div className="p-8 max-w-3xl">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold">Team & access</h2>
        <p className="text-zinc-500 mt-1">
          Add or remove collaborators with access to each platform
        </p>
      </header>

      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-zinc-800 bg-[#12121a] p-4 mb-8 space-y-3"
      >
        <h3 className="text-sm font-medium flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add user
        </h3>
        <div className="flex flex-wrap gap-3">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm flex-1 min-w-[120px]"
          />
          <input
            placeholder="Display name (optional)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm flex-1 min-w-[120px]"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Add
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-zinc-500">Loading…</p>
      ) : (
        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={`${u.platform}-${u.username}`}
              className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#12121a] p-4"
            >
              <PlatformBadge platform={u.platform} />
              <div className="flex-1 min-w-0">
                <p className="font-medium">@{u.username}</p>
                <p className="text-sm text-zinc-500">
                  {u.displayName} · {u.role}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(u.platform, u.username)}
                className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                aria-label="Remove user"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
