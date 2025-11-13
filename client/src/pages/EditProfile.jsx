import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import RoleHeader from "../components/RoleHeader";

export default function EditProfilePage() 
{
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => 
  {
    e.preventDefault();
    setError("");
    try 
    {
      setLoading(true);
      const updated = await updateProfile(form); // returns updated user object
      // update auth context/localStorage with the new user data
      login(updated, localStorage.getItem("token"));
      navigate(user?.role === "farmer" ? "/farmer/dashboard" : "/customer/dashboard");
    } catch (err) 
    {
      setError(err?.response?.data?.message || err?.message || "Update failed");
    } finally 
    {
      setLoading(false);
    }
  };

  return (
    <>
    <RoleHeader />
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="grid gap-3">
        <label className="flex flex-col">
          <span className="text-sm font-medium">Name</span>
          <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">Email</span>
          <input name="email" value={form.email} onChange={handleChange} type="email" className="border p-2 rounded" required />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">Phone</span>
          <input name="phone" value={form.phone} onChange={handleChange} className="border p-2 rounded" />
        </label>

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-200 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
