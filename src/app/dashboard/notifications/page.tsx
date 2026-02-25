"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { pushApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendForm, setSendForm] = useState({ title: "", body: "" });
  const [targetUserId, setTargetUserId] = useState("");
  const [sendMode, setSendMode] = useState<"all" | "user">("all");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pushSubscribed");
    setSubscribed(saved === "true");
  }, []);

  const handleSubscribe = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications not supported");
      return;
    }
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Permission denied");
        return;
      }
      // Mock subscription data (in production use real ServiceWorker push)
      const mockSub = {
        endpoint: `https://push.example.com/${user?.id || "device"}`,
        keys: { p256dh: "mock-key", auth: "mock-auth" },
      };
      await pushApi.subscribe(mockSub);
      localStorage.setItem("pushSubscribed", "true");
      setSubscribed(true);
      toast.success("Push notifications enabled!");
    } catch {
      toast.error("Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      await pushApi.unsubscribe(`https://push.example.com/${user?.id || "device"}`);
      localStorage.setItem("pushSubscribed", "false");
      setSubscribed(false);
      toast.success("Unsubscribed from notifications");
    } catch {
      toast.error("Failed to unsubscribe");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendForm.title || !sendForm.body) return;
    setSending(true);
    try {
      if (sendMode === "all") {
        await pushApi.sendToAll(sendForm);
        toast.success("Notification sent to all users");
      } else {
        if (!targetUserId) { toast.error("Enter user ID"); return; }
        await pushApi.sendToUser(targetUserId, sendForm);
        toast.success("Notification sent to user");
      }
      setSendForm({ title: "", body: "" });
      setTargetUserId("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl text-ivory font-semibold">Push Notifications</h1>
        <p className="text-mist mt-1 text-sm">Manage device subscriptions and send notifications</p>
      </div>

      {/* Subscription Status */}
      <div className="glass rounded-2xl p-6 border border-ash/40">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-ghost font-medium">Device Subscription</h2>
            <p className="text-mist text-sm mt-0.5">Enable push notifications on this device</p>
          </div>
          <div
            className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border
              ${subscribed
                ? "text-jade bg-jade/10 border-jade/20"
                : "text-mist bg-ash/30 border-ash"
              }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${subscribed ? "bg-jade animate-pulse" : "bg-mist"}`} />
            {subscribed ? "Subscribed" : "Not subscribed"}
          </div>
        </div>
        <button
          onClick={subscribed ? handleUnsubscribe : handleSubscribe}
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
            ${subscribed
              ? "border border-crimson/30 text-crimson hover:bg-crimson/10"
              : "bg-aurora hover:bg-aurora-light text-white"
            }`}
        >
          {loading ? (
            <div className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
          ) : subscribed ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Unsubscribe
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              Enable Notifications
            </>
          )}
        </button>
      </div>

      {/* Send Notification */}
      <div className="glass rounded-2xl p-6 border border-ash/40">
        <h2 className="text-ghost font-medium mb-4">Send Notification</h2>
        
        {/* Mode Tabs */}
        <div className="flex bg-obsidian-3 rounded-xl p-1 mb-4">
          {(["all", "user"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSendMode(mode)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${sendMode === mode
                  ? "bg-aurora text-white"
                  : "text-mist hover:text-ghost"
                }`}
            >
              {mode === "all" ? "Send to All" : "Send to User"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="space-y-4">
          {sendMode === "user" && (
            <div>
              <label className="text-xs text-silver font-medium mb-1.5 block tracking-wide">USER ID</label>
              <input
                type="text"
                className="auth-input font-mono"
                placeholder="Enter user ID"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="text-xs text-silver font-medium mb-1.5 block tracking-wide">TITLE</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Notification title"
              value={sendForm.title}
              onChange={(e) => setSendForm({ ...sendForm, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs text-silver font-medium mb-1.5 block tracking-wide">MESSAGE</label>
            <textarea
              className="auth-input resize-none"
              rows={3}
              placeholder="Notification body..."
              value={sendForm.body}
              onChange={(e) => setSendForm({ ...sendForm, body: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={sending}>
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Send Notification
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
