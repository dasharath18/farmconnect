import axios from "axios";
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const addToWishlist = async (cropId) => {
  try {
    const res = await axios.post(`${BASE}/api/wishlist`, { cropId }, {
      headers: getAuthHeader(),
    });
    const wishlistItem = res.data;
    window.dispatchEvent(new CustomEvent("wishlistChanged", {
      detail: { action: "add", cropId, wishlistItem }
    }));
    return wishlistItem;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to add to wishlist";
    throw new Error(msg);
  }
};

export const removeFromWishlist = async (wishlistId) => {
  try {
    const res = await axios.delete(`${BASE}/api/wishlist/${wishlistId}`, {
      headers: getAuthHeader()
    });
    window.dispatchEvent(new CustomEvent("wishlistChanged", {
      detail: { action: "remove", wishlistId }
    }));
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to remove from wishlist";
    throw new Error(msg);
  }
};

export const getWishlist = async () => {
  try {
    const res = await axios.get(`${BASE}/api/wishlist`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to load wishlist";
    throw new Error(msg);
  }
};
