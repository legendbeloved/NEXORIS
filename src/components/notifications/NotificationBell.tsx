import React from "react";
import { Bell } from "lucide-react";
import { motion } from "motion/react";
import { useNotificationStore } from "../../store/notificationStore";

export function NotificationBell() {
  const unread = useNotificationStore((s) => s.unreadCount);
  const shake = useNotificationStore((s) => s.bellShaking);
  const toggle = useNotificationStore((s) => s.togglePanel);

  return (
    <motion.button
      data-tour="notification-bell"
      onClick={toggle}
      aria-label={`Notifications, ${unread} unread`}
      aria-haspopup="dialog"
      aria-expanded={false}
      className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all relative"
      animate={shake ? { rotate: [-5, 5, -4, 4, -3, 3, -2, 2, 0] } : { rotate: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Bell size={20} strokeWidth={1.5} />
      {unread > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.25 }}
          className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-zinc-900"
        >
          {unread > 99 ? "99+" : unread}
        </motion.div>
      )}
    </motion.button>
  );
}
