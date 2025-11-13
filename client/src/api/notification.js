import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const getNotifications = async (token) => {
  const res = await axios.get(`${API}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const markNotificationRead = async (id, token) => {
  const res = await axios.put(
    `${API}/api/notifications/read/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteNotification = async (id, token) => {
  const res = await axios.delete(`${API}/api/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getUnreadCount = async (token) => {
  const res = await axios.get(`${API}/api/notifications/count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
