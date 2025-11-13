import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const addToWishlist = async (cropId) => {
  const res = await axios.post(
    `${API}/api/wishlist`,
    { cropId },
    { headers: getAuthHeader() }
  );
  return res.data;
};

export const removeFromWishlist = async (wishlistId) => {
  const res = await axios.delete(`${API}/api/wishlist/${wishlistId}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getWishlist = async () => {
  const res = await axios.get(`${API}/api/wishlist`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
