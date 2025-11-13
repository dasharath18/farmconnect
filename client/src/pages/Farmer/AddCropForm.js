import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import RoleHeader from "../../components/RoleHeader";

const productList = [
  "Wheat", "Rice", "Maize", "Sugarcane", "Barley",
  "Cotton", "Soybean", "Groundnut", "Mustard", "Pulses"
];
const stateList = [
  "Andhra Pradesh", "Maharashtra", "Punjab", "Karnataka",
  "Uttar Pradesh", "Bihar", "Tamil Nadu", "Gujarat"
];

export default function AddCropForm() 
{
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

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => 
  {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try 
    {
      const res = await axios.post(
        "http://localhost:5000/api/crops",
        formData,
        {
          headers: 
          {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("✅ Crop added successfully!");
      setFormData({
        product: "",
        quantity: "",
        unit: "kg",
        state: "",
        location: "",
        phone: "",
        email: "",
      });
    } 
    catch (err) 
    {
      console.error(err);
      setMessage("❌ Failed to add crop.");
    } 
    finally 
    {
      setLoading(false);
    }
  };

  return (
    <>
    <RoleHeader/>
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block">Product</label>
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="w-full border p-2"
            required
          >
            <option value="">Select Product</option>
            {productList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label className="block">Unit</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="kg">Kilograms</option>
            <option value="quintal">Quintals</option>
          </select>
        </div>

        <div>
          <label className="block">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border p-2"
            required
          >
            <option value="">Select State</option>
            {stateList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">Other Location Details</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label className="block">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label className="block">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Adding..." : "Add Crop"}
        </button>

        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
    </>
  );
}
