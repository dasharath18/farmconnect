import axios from "axios";

export const updateProfile = async (data) => 
{
  const res = await axios.put("http://localhost:5000/api/auth/me", data);
  return res.data;
};
