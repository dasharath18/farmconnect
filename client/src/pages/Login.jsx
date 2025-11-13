import AuthForm from "../components/AuthForm";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() 
{
  const { login } = useAuth();

  const handleLogin = async (formData) => 
  {
    try 
    {
      const res = await axios.post("http://localhost:5000/api/auth/login", 
      {
        email: formData.email,
        password: formData.password,
      });

      // 1️⃣ Save token in localStorage so it persists after refresh
      localStorage.setItem("token", res.data.token);

      // 2️⃣ Set axios default header so all future requests include token
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      // 3️⃣ Call your context login function
      login(res.data.user, res.data.token);

      // 4️⃣ Redirect based on role
      if (res.data.user.role === "farmer") 
      {
        window.location.href = "/farmer/dashboard";
      }
      else 
      {
        window.location.href = "/customer/dashboard";
      }
    } 
    catch (err) 
    {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return <AuthForm isRegister={false} onSubmit={handleLogin} />;
}
