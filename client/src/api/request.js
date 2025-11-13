import axios from "axios";
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create a new request
export const createRequest = async (payload, token) => {
  const res = await axios.post(`${BASE}/api/requests`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get requests (all or mine=true)
export const getRequests = async (query = {}, token) => {
  const params = new URLSearchParams(query).toString();
  const url = `${BASE}/api/requests${params ? `?${params}` : ""}`;
  const res = await axios.get(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// Add customer request to farmer wishlist
export const wishlistRequest = async (requestId, token) => {
  const res = await axios.post(
    `${BASE}/api/requests/${requestId}/wishlist`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// ---------------- NEW: Get single request by id ----------------
export const getRequestById = async (id, token) => {
  const res = await axios.get(`${BASE}/api/requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ---------------- NEW: Update request ----------------
export const updateRequest = async (id, payload, token) => {
  const res = await axios.put(`${BASE}/api/requests/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ---------------- NEW: Delete request ----------------
export const deleteRequest = async (id, token) => {
  const res = await axios.delete(`${BASE}/api/requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getFarmerWishlist = async (token) => {
  const res = await axios.get(`${BASE}/api/requests/wishlist/farmer`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
