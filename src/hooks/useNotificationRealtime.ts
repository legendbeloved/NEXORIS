import { useEffect } from "react";
import { supabaseClient } from "../lib/supabase";
import { useNotificationStore } from "../store/notificationStore";

function playTone(priority: "NORMAL" | "HIGH" | "URGENT") {
  if (typeof window === "undefined") return;
  if (document.hidden) return;
  // @ts-ignore
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g);
  g.connect(ctx.destination);
  const now = ctx.currentTime;
  let freq = 220;
  let dur = 0.15;
  let vol = 0.1;
  if (priority === "HIGH") {
    freq = 330;
    dur = 0.2;
    vol = 0.15;
  } else if (priority === "URGENT") {
    const o2 = ctx.createOscillator();
    o2.frequency.value = 440;
    const g2 = ctx.createGain();
    g2.gain.value = 0.2;
    o2.connect(g2);
    g2.connect(ctx.destination);
    o2.type = "sine";
    o2.start(now);
    o2.stop(now + 0.25);
    freq = 330;
    dur = 0.25;
    vol = 0.2;
  }
  o.frequency.value = freq;
  o.type = "sine";
  g.gain.setValueAtTime(vol, now);
  o.start(now);
  o.stop(now + dur);
}

export function useNotificationRealtime(userId?: string | null) {
  const add = useNotificationStore((s) => s.addNotification);
  const inc = useNotificationStore((s) => s.incrementUnread);
  const shake = useNotificationStore((s) => s.triggerBellShake);

  useEffect(() => {
    if (!userId) return;
    const ch = supabaseClient
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `owner_id=eq.${userId}` },
        (payload) => {
          const n = payload.new as any;
          add({
            id: String(n.id),
            owner_id: n.owner_id,
            type: n.type,
            title: n.title,
            message: n.message,
            priority: n.priority,
            action_url: n.action_url,
            is_read: n.is_read,
            requires_action: n.requires_action,
            prospect_id: n.prospect_id,
            project_id: n.project_id,
            created_at: n.created_at,
          } as any);
          inc();
          if (n.priority === "URGENT" || n.requires_action) {
            shake();
            playTone(n.priority);
          }
        }
      )
      .subscribe();
    return () => {
      try {
        supabaseClient.removeChannel(ch);
      } catch {}
    };
  }, [userId]);
}
