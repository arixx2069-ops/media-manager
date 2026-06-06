"use client";

import { useEffect, useState } from "react";
import { Shield, UserPlus, UserX, Check, X, Clock } from "lucide-react";

interface AccessUser {
  id: string;
  email: string;
  name: string | null;
  status: string;
  createdAt: string;
}

export default function AccessControlPage() {
  const [users, setUsers] = useState<AccessUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/access");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail) return;

    setAdding(true);
    try {
      const res = await fetch("/api/admin/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, name: newName || null }),
      });

      if (res.ok) {
        setNewEmail("");
        setNewName("");
        loadUsers();
      }
    } catch (error) {
      console.error("Failed to add user:", error);
    } finally {
      setAdding(false);
    }
  }

  async function handleUpdateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/access/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        loadUsers();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  async function handleDeleteUser(id: string) {
    if (!confirm("Are you sure you want to remove this user?")) return;

    try {
      const res = await fetch(`/api/admin/access/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadUsers();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }

  const pendingUsers = users.filter((u) => u.status === "pending");
  const approvedUsers = users.filter((u) => u.status === "approved");
  const deniedUsers = users.filter((u) => u.status === "denied");

  return (
    <div className="page-shell max-w-6xl mx-auto w-full">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 text-[var(--accent)]" style={{ background: "var(--accent-soft)" }}>
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Access Control</h1>
            <p className="text-sm text-[var(--muted)]">Manage who can access your website</p>
          </div>
        </div>
      </header>

      {/* Add User Form */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Add New User</h2>
        <form onSubmit={handleAddUser} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-[var(--foreground)] text-sm"
              placeholder="user@example.com"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Name (optional)</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-[var(--foreground)] text-sm"
              placeholder="John Doe"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={adding}
              className="btn-primary"
            >
              <UserPlus className="w-4 h-4" />
              {adding ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-8 text-[var(--muted)]">Loading...</div>
      ) : (
        <div className="space-y-6">
          {/* Pending Requests */}
          {pendingUsers.length > 0 && (
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                Pending Requests ({pendingUsers.length})
              </h2>
              <div className="space-y-3">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-[var(--background)] border border-[var(--card-border)]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{user.name || user.email}</p>
                      <p className="text-sm text-[var(--muted)]">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(user.id, "approved")}
                        className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-sm px-3 py-1.5 rounded-lg"
                      >
                        <Check className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(user.id, "denied")}
                        className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-1.5 rounded-lg"
                      >
                        <X className="w-3 h-3" />
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Users */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Approved Users ({approvedUsers.length})
            </h2>
            {approvedUsers.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No approved users yet</p>
            ) : (
              <div className="space-y-3">
                {approvedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-[var(--background)] border border-[var(--card-border)]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{user.name || user.email}</p>
                      <p className="text-sm text-[var(--muted)]">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 text-sm px-3 py-1.5 rounded-lg"
                    >
                      <UserX className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Denied Users */}
          {deniedUsers.length > 0 && (
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                Denied Users ({deniedUsers.length})
              </h2>
              <div className="space-y-3">
                {deniedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-[var(--background)] border border-[var(--card-border)]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{user.name || user.email}</p>
                      <p className="text-sm text-[var(--muted)]">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(user.id, "approved")}
                        className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-sm px-3 py-1.5 rounded-lg"
                      >
                        <Check className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 text-sm px-3 py-1.5 rounded-lg"
                      >
                        <UserX className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
