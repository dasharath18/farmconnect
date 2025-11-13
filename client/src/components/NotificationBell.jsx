// client/src/components/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import { getNotifications, markNotificationRead } from "../api/notification";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!token) return;
        const data = await getNotifications(token);
        if (!mounted) return;
        const unread = data.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("notif bell load error", err);
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  return (
    <div className="relative">
      <button onClick={() => navigate("/notifications")} className="p-2">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">{unreadCount}</span>
        )}
      </button>
    </div>
  );
}
