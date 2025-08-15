import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RoleHeader from "../components/RoleHeader";


export default function CustomerDashboard() 
{
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    
  <>
  <RoleHeader/>
  <main className="container mx-auto px-6 py-6">
     <div className="p-4">
      <h1 className = "text-xl font-semibold mb-4">Welcome, {user?.name}</h1>
      <button onClick={() => navigate("/profile/edit")} className=" bg-green-500 text-white px-4 py-2 rounded">Edit Profile</button>
      <button onClick={logout} className="ml-2 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  </main>
</>
  );
}
