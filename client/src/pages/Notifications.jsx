// client/src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import { getNotifications, markNotificationRead } from "../api/notification";
import { useAuth } from "../context/AuthContext";
import RoleHeader from "../components/RoleHeader";
import { toast } from "react-toastify";

export default function NotificationsPage() {
  const { token } = useAuth();
  const [notifs, setNotifs] = useState([]);

  const load = async () => {
    try {
      const data = await getNotifications(token);
      setNotifs(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const markRead = async (id) => {
    try {
      await markNotificationRead(id, token);
      setNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark read");
    }
  };

  return (
    <>
      <RoleHeader />
      <div className="p-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        {notifs.length === 0 ? <div>No notifications</div> : (
          <div className="space-y-2">
            {notifs.map(n => (
              <div key={n._id} className={`p-3 border rounded ${n.read ? 'bg-white' : 'bg-yellow-50'}`}>
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{n.message}</div>
                    <div className="text-sm text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  {!n.read && <button onClick={() => markRead(n._id)} className="text-sm text-blue-600">Mark read</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
