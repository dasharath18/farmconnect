import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import RoleHeader from "../components/RoleHeader";

const API = process.env.REACT_APP_API_URL;

const productOptions = [
  "Wheat", "Rice", "Maize", "Sugarcane", "Barley",
  "Cotton", "Soybean", "Groundnut", "Mustard", "Pulses"
];

const stateOptions = [
  "Andhra Pradesh", "Maharashtra", "Punjab", "Karnataka",
  "Uttar Pradesh", "Bihar", "Tamil Nadu", "Gujarat"
];

export default function EditCropForm() {
  const [crop, setCrop] = useState({
    product: "",
    quantity: "",
    unit: "kg",
    state: "",
    location: "",
    phone: "",
    email: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/api/crops/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCrop(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    setCrop({ ...crop, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${API}/api/crops/${id}`, crop, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        toast.success("Crop updated successfully!");
        navigate("/farmer/my-crops");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update crop.");
      });
  };


  return (
    <>
      <RoleHeader />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Edit Crop</h2>
        <form onSubmit={handleSubmit}>
          {/* Product */}
          <div>
            <label htmlFor="product" className="block">Product</label>
            <select
              id="product"
              name="product"
              value={crop.product}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Product</option>
              {productOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Unit */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <label htmlFor="quantity" className="block">Quantity</label>
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={crop.quantity}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="unit" className="block">Unit</label>
              <select
                id="unit"
                name="unit"
                value={crop.unit}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              >
                <option value="kg">Kg</option>
                <option value="quintal">Quintal</option>
              </select>
            </div>
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block">State</label>
            <select
              id="state"
              name="state"
              value={crop.state}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select State</option>
              {stateOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block">Specific Location</label>
            <input
              id="location"
              type="text"
              name="location"
              value={crop.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={crop.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={crop.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Submit */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
            Update Crop
          </button>
        </form>
      </div>
    </>
  );
}
