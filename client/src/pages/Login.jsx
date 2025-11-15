import AuthForm from "../components/AuthForm";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL;

export default function Login() {
  const { login } = useAuth();

  const handleLogin = async (formData) => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      login(res.data.user, res.data.token);

      if (res.data.user.role === "farmer") {
        window.location.href = "/farmer/dashboard";
      } else {
        window.location.href = "/customer/dashboard";
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return <AuthForm isRegister={false} onSubmit={handleLogin} />;
}
