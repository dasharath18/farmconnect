import AuthForm from "../components/AuthForm";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function Register() {
  const handleRegister = async (formData) => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, formData);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return <AuthForm isRegister={true} onSubmit={handleRegister} />;
}
