import axios from "axios";
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const createRequest = async (payload, token) => {
  const res = await axios.post(`${BASE}/api/requests`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getRequests = async (query = {}, token) => {
  const params = new URLSearchParams(query).toString();
  const url = `${BASE}/api/requests${params ? `?${params}` : ""}`;
  const res = await axios.get(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

export const wishlistRequest = async (requestId, token) => {
  const res = await axios.post(`${BASE}/api/requests/${requestId}/wishlist`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
