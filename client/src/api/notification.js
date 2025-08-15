import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getNotifications = async (token) => {
  const res = await axios.get(`${BASE}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteNotification = async (id, token) => {
  const res = await axios.delete(`${BASE}/api/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
