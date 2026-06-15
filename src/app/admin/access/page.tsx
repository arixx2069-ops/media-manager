"use client";

import { useState, useEffect } from "react";
import { Shield, Plus, Trash2 } from "lucide-react";

interface AccessEntry {
  id: string;
  name: string;
  platform: string;
  role: string;
  createdAt: string;
}

export default function AccessPage() {
  const [entries, setEntries] = useState<AccessEntry[]>([]);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("all");
  const [role, setRole] = useState("viewer");

  useEffect(() => {
    fetch("/api/admin/access")
      .then((r) => r.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => {});
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch("/api/admin/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), platform, role }),
      });
      const data = await res.json();
      if (data.entry) {
        setEntries((prev) => [...prev, data.entry]);
      }
      setName("");
    } catch {
      // ignore
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/admin/access/${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      // ignore
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Access Control</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Manage who can access this app
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="editorial-card p-4 sm:p-6 space-y-3"
      >
        <h2 className="font-display text-base font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add user
        </h2>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm"
            placeholder="User name"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)]"
            >
              <option value="all">All</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)]"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {entries.length > 0 && (
        <div className="editorial-card p-4 sm:p-6 space-y-3">
          <h2 className="font-display text-base font-semibold">
            Users ({entries.length})
          </h2>
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{entry.name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {entry.platform} &middot; {entry.role}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  className="text-[var(--muted)] hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
