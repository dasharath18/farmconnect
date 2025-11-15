import axios from "axios";

export const updateProfile = async (data) => 
{
  const res = await axios.put("http://localhost:5000/api/auth/me", data);
  return res.data;
};
// import axios from "axios";

// const API = process.env.REACT_APP_API_URL;

// export const updateProfile = async (data) => {
//   const res = await axios.put(`${API}/api/auth/me`, data);
//   return res.data;
// };

// export const login = async (email, password) => {
//   const res = await axios.post(`${API}/api/auth/login`, { email, password });
//   return res.data;
// };

// export const registerUser = async (payload) => {
//   const res = await axios.post(`${API}/api/auth/register`, payload);
//   return res.data;
// };
