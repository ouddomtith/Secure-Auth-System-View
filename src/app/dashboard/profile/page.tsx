"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store";
import { userApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ username: user?.username || "", email: user?.email || "" });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userApi.updateProfile(form);
      setUser(res.data);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userApi.deleteAccount();
      toast.success("Account deleted");
      logout();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl text-ivory font-semibold">Profile Settings</h1>
        <p className="text-mist mt-1 text-sm">Manage your account information</p>
      </div>

      {/* Avatar */}
      <div className="glass rounded-2xl p-6 border border-ash/40">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-aurora/20 border-2 border-aurora/30 flex items-center justify-center text-aurora-light text-2xl font-display font-semibold">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-ivory font-medium text-lg">{user?.username}</p>
            <p className="text-mist text-sm">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-jade" />
              <span className="text-jade text-xs">{user?.role || "User"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="glass rounded-2xl p-6 border border-ash/40">
        <h2 className="text-ghost font-medium mb-4">Account Information</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-xs text-silver font-medium mb-1.5 block tracking-wide">USERNAME</label>
            <input
              type="text"
              className="auth-input"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs text-silver font-medium mb-1.5 block tracking-wide">EMAIL ADDRESS</label>
            <input
              type="email"
              className="auth-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-auto px-8" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Saving...
              </span>
            ) : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass rounded-2xl p-6 border border-crimson/20">
        <h2 className="text-crimson font-medium mb-2">Danger Zone</h2>
        <p className="text-mist text-sm mb-4">Once deleted, your account cannot be recovered.</p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-crimson border border-crimson/30 hover:bg-crimson/10 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete Account
          </button>
        ) : (
          <div className="bg-crimson/10 border border-crimson/30 rounded-xl p-4 space-y-3">
            <p className="text-ghost text-sm font-medium">Are you absolutely sure?</p>
            <p className="text-mist text-xs">This action cannot be undone. All your data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-crimson hover:bg-crimson/80 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                {deleting ? "Deleting..." : "Yes, delete my account"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-mist hover:text-ghost px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
