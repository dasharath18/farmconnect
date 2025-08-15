import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import RoleHeader from "../components/RoleHeader";

export default function FarmerDashboard() 
{
 const { user, logout } = useAuth();
  return (
    <>
  <RoleHeader />
  <main className="container mx-auto px-6 py-6">
     <div className="p-4" >
      <h1 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h1>
      <Link to="/profile/edit" className="inline-block  bg-green-500 text-white px-4 py-2 rounded gap-2">Edit Profile</Link>
      <button onClick={logout}  className="ml-2 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  </main>
</>
  );
}

