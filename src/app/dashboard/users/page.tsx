"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { userApi } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    userApi.getAllUsers()
      .then(res => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ivory font-semibold">User Management</h1>
          <p className="text-mist mt-1 text-sm">{users.length} total users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          className="auth-input pl-10"
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users table */}
      <div className="glass rounded-2xl border border-ash/40 overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-aurora/30 border-t-aurora animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto text-mist mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <p className="text-mist text-sm">No users found</p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-ash/40 text-xs text-mist font-medium tracking-wider">
              <div className="col-span-4">USER</div>
              <div className="col-span-4">EMAIL</div>
              <div className="col-span-2">ROLE</div>
              <div className="col-span-2">STATUS</div>
            </div>
            {/* Rows */}
            <div className="divide-y divide-ash/30">
              {filtered.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-obsidian-4/50 transition-colors group">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-aurora/15 border border-aurora/20 flex items-center justify-center text-aurora-light text-sm font-medium shrink-0">
                      {user.username?.[0]?.toUpperCase() || "?"}
                    </div>
                    <span className="text-ghost text-sm font-medium truncate">{user.username}</span>
                  </div>
                  <div className="col-span-4 text-mist text-sm truncate font-mono text-xs">{user.email}</div>
                  <div className="col-span-2">
                    <span className={`text-xs px-2 py-1 rounded-lg border
                      ${user.role === "ADMIN"
                        ? "text-amber bg-amber/10 border-amber/20"
                        : "text-silver bg-ash/30 border-ash"
                      }`}
                    >
                      {user.role || "USER"}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-jade" />
                    <span className="text-jade text-xs">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
