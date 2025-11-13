// client/src/pages/EditRequest.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRequestById, updateRequest } from "../api/request";
import { useAuth } from "../context/AuthContext";
import RoleHeader from "../components/RoleHeader";
import { toast } from "react-toastify";

export default function EditRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    unit: "kg",
    state: "",
    location: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRequestById(id, token);
        setFormData({
          product: data.product || "",
          quantity: data.quantity || "",
          unit: data.unit || "kg",
          state: data.state || "",
          location: data.location || "",
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load request.");
      }
    })();
  }, [id, token]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateRequest(id, formData, token);
      toast.success("Request updated");
      navigate("/customer/requests");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RoleHeader />
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Request</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label>Product</label>
            <input name="product" value={formData.product} onChange={handleChange} className="w-full border p-2" required />
          </div>
          <div>
            <label>Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border p-2" required />
          </div>
          <div>
            <label>Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className="w-full border p-2">
              <option value="kg">Kilograms</option>
              <option value="quintal">Quintals</option>
            </select>
          </div>
          <div>
            <label>State</label>
            <input name="state" value={formData.state} onChange={handleChange} className="w-full border p-2" />
          </div>
          <div>
            <label>Location</label>
            <input name="location" value={formData.location} onChange={handleChange} className="w-full border p-2" />
          </div>
          <div>
            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2" />
          </div>
          <div>
            <label>Email</label>
            <input name="email" value={formData.email} onChange={handleChange} className="w-full border p-2" />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
