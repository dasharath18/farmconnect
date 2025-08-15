import AuthForm from "../components/AuthForm";
import axios from "axios";

export default function Register() 
{
  const handleRegister = async (formData) => 
  {
    try 
    {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(res.data.message);
    }
    catch (err) 
    {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return <AuthForm isRegister={true} onSubmit={handleRegister} />;
}
