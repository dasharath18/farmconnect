import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  getNotifications, 
  deleteNotification, 
  markNotificationRead 
} from "../api/notification";

const Notifications = ({ compact = false }) => {
  const { token } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Load notifications
  useEffect(() => {
    if (!token) {
      setNotifs([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getNotifications(token);
        if (!cancelled) setNotifs(data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id, token);
      setNotifs((s) => s.filter((n) => n._id !== id));
    } catch (err) {
      console.error("delete notification failed", err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id, token);
      setNotifs(prev => prev.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error("mark read failed", err);
    }
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  /* ---------------- COMPACT MODE (Bell dropdown) ---------------- */
  if (compact) {
    return (
      <div className="relative" ref={panelRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Notifications"
          className="relative p-1 rounded hover:bg-gray-100"
        >
          <span className="text-2xl">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white text-black border rounded shadow-lg z-50">
            <div className="p-2 font-bold border-b">Notifications</div>
            {notifs.length === 0 && <div className="p-2">No notifications</div>}
            
            {notifs.map((n) => (
              <div key={n._id} className={`p-2 border-b ${!n.read ? "bg-yellow-50" : ""}`}>
                <div className="text-sm">{n.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  From: {n.fromUser?.name || "User"} • {new Date(n.createdAt).toLocaleString()}
                </div>
                
                <div className="mt-2 flex gap-3">
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n._id)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Mark read
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(n._id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ---------------- FULL PAGE MODE ---------------- */
  return (
    <div className="p-2" ref={panelRef}>
      <h3 className="font-bold mb-2">Notifications</h3>
      
      {notifs.length === 0 && <div>No notifications</div>}
      
      {notifs.map((n) => (
        <div key={n._id} className={`p-2 border-b ${!n.read ? "bg-yellow-50" : ""}`}>
          <div>{n.message}</div>
          <div className="text-xs text-gray-500">From: {n.fromUser?.name}</div>

          <div className="mt-1 flex gap-3">
            {!n.read && (
              <button
                onClick={() => handleMarkRead(n._id)}
                className="text-xs text-blue-600"
              >
                Mark read
              </button>
            )}
            <button
              onClick={() => handleDelete(n._id)}
              className="text-xs text-red-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
