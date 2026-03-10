import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";
import { useNotificationStore } from "../../store/notificationStore";

function groupByDate(list: any[]) {
  const groups: Record<string, any[]> = {};
  for (const n of list) {
    const d = new Date(n.created_at || Date.now());
    const key = d.toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  }
  return Object.entries(groups).map(([k, v]) => ({ key: k, items: v }));
}

export function NotificationCenter() {
  const isOpen = useNotificationStore((s) => s.isPanelOpen);
  const close = useNotificationStore((s) => s.closePanel);
  const ns = useNotificationStore((s) => s.notifications);
  const filter = useNotificationStore((s) => s.activeFilter);
  const setFilter = useNotificationStore((s) => s.setFilter);
  const markAll = useNotificationStore((s) => s.markAllRead);
  const markRead = useNotificationStore((s) => s.markRead);
  const loadMore = useNotificationStore((s) => s.loadMore);
  const hasMore = useNotificationStore((s) => s.hasMore);
  const isLoading = useNotificationStore((s) => s.isLoading);

  const filtered = ns.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "urgent") return n.priority === "URGENT";
    if (filter === "action") return n.requires_action;
    return true;
  });

  const groups = groupByDate(filtered);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/50 z-[399]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            key="panel"
            className="fixed top-16 right-0 w-[380px] max-w-[100vw] h-[calc(100vh-64px)] bg-[var(--bg-elevated)] border-l border-[var(--border-default)] backdrop-blur-xl shadow-2xl z-[400] flex flex-col"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="p-4 border-b border-[var(--border-default)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold">Notifications</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={markAll} className="text-xs text-indigo-300 disabled:text-zinc-600" disabled={!ns.some((x) => !x.is_read)}>
                  Mark all read
                </button>
                <button onClick={close} className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="px-4 pt-3">
              <div className="flex items-center gap-4 text-sm">
                <button onClick={() => setFilter("all")} className={filter === "all" ? "text-indigo-300" : "text-zinc-400"}>
                  All
                </button>
                <button onClick={() => setFilter("unread")} className={filter === "unread" ? "text-indigo-300" : "text-zinc-400"}>
                  Unread
                </button>
                <button onClick={() => setFilter("urgent")} className={filter === "urgent" ? "text-indigo-300" : "text-zinc-400"}>
                  Urgent
                </button>
                <button onClick={() => setFilter("action")} className={filter === "action" ? "text-indigo-300" : "text-zinc-400"}>
                  Requires Action
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto mt-3 pb-4">
              {groups.map((g) => (
                <div key={g.key} className="px-4 mb-2">
                  <div className="text-center text-[11px] uppercase text-zinc-500 py-1">{g.key}</div>
                  {g.items.map((n: any) => (
                    <motion.div
                      key={n.id}
                      layoutId={`n-${n.id}`}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      className={`p-3 rounded-xl mb-2 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors ${
                        n.priority === "URGENT" ? "relative" : ""
                      }`}
                      onClick={() => markRead(String(n.id))}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-1.5 h-6 rounded ${
                            n.priority === "LOW"
                              ? "#3D4470"
                              : n.priority === "NORMAL"
                              ? "bg-zinc-600"
                              : n.priority === "HIGH"
                              ? "bg-indigo-500"
                              : "bg-amber-500"
                          }`}
                          style={{ background: n.priority === "LOW" ? "#3D4470" : undefined }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {!n.is_read && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                            <div className="text-sm font-semibold">{n.title}</div>
                            {n.requires_action && <span className="text-[10px] text-amber-400 border border-amber-400/40 px-1.5 py-0.5 rounded">Requires Action</span>}
                          </div>
                          <div className="text-xs text-zinc-400">{n.message}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-zinc-600 gap-2">
                  <CheckCircle2 size={24} className="text-emerald-500" />
                  <div className="text-sm">All clear — your agents are on it.</div>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-white/10">
              {hasMore ? (
                <button onClick={loadMore} disabled={isLoading} className="text-sm text-indigo-300 disabled:text-zinc-600">
                  {isLoading ? "Loading..." : "Load more"}
                </button>
              ) : (
                <div className="text-xs text-zinc-600">No more</div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
