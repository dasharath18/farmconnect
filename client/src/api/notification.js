import axios from "axios";
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Get all notifications
export const getNotifications = async (token) => {
  const res = await axios.get(`${BASE}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// MARK notification as READ
export const markNotificationRead = async (id, token) => {
  const res = await axios.put(
    `${BASE}/api/notifications/read/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// DELETE notification (dismiss)
export const deleteNotification = async (id, token) => {
  const res = await axios.delete(`${BASE}/api/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get unread notifications count
export const getUnreadCount = async (token) => {
  const res = await axios.get(`${BASE}/api/notifications/count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
