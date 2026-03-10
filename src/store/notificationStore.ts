import { create } from "zustand";

export type Priority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface Notification {
  id: string;
  owner_id?: string | null;
  type: string;
  title: string;
  message: string;
  priority: Priority;
  action_url?: string | null;
  is_read: boolean;
  requires_action: boolean;
  prospect_id?: string | number | null;
  project_id?: string | number | null;
  created_at?: string;
}

interface State {
  notifications: Notification[];
  unreadCount: number;
  isPanelOpen: boolean;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  activeFilter: "all" | "unread" | "urgent" | "action";
  bellShaking: boolean;
}

interface Actions {
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  setFilter: (f: State["activeFilter"]) => void;
  setNotifications: (list: Notification[]) => void;
  addNotification: (n: Notification) => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  setUnreadCount: (c: number) => void;
  incrementUnread: () => void;
  loadMore: () => Promise<void>;
  triggerBellShake: () => void;
}

type Store = State & Actions;

export const useNotificationStore = create<Store>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isPanelOpen: false,
  isLoading: false,
  hasMore: true,
  page: 1,
  activeFilter: "all",
  bellShaking: false,
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),
  setFilter: (f) => set({ activeFilter: f }),
  setNotifications: (list) => set({ notifications: list }),
  addNotification: (n) => {
    const filtered = [n, ...get().notifications];
    const urgent = n.priority === "URGENT" || n.requires_action;
    set({
      notifications: filtered,
      unreadCount: get().unreadCount + 1,
    });
    if (urgent) get().triggerBellShake();
  },
  markRead: async (id: string) => {
    const prev = get().notifications.slice();
    set({
      notifications: prev.map((x) => (String(x.id) === String(id) ? { ...x, is_read: true } : x)),
      unreadCount: Math.max(0, get().unreadCount - 1),
    });
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    } catch {
      set({ notifications: prev });
    }
  },
  markAllRead: async () => {
    const prev = get().notifications.slice();
    set({
      notifications: prev.map((x) => ({ ...x, is_read: true })),
      unreadCount: 0,
    });
    try {
      await fetch(`/api/notifications/read-all`, { method: "POST" });
    } catch {
      set({ notifications: prev });
    }
  },
  setUnreadCount: (c) => set({ unreadCount: c }),
  incrementUnread: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
  loadMore: async () => {
    if (!get().hasMore) return;
    const nextPage = get().page + 1;
    set({ isLoading: true });
    try {
      const r = await fetch(`/api/notifications?page=${nextPage}&limit=20`);
      const j = await r.json();
      const existing = get().notifications;
      const merged = [...existing, ...(j?.data?.notifications || [])];
      set({
        notifications: merged,
        page: nextPage,
        hasMore: merged.length < (j?.data?.total || 0),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
  triggerBellShake: () => {
    set({ bellShaking: true });
    setTimeout(() => set({ bellShaking: false }), 500);
  },
}));
