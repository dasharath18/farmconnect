import React, { useEffect, useState } from "react";
import { getFarmerWishlist } from "../api/request";
import { useAuth } from "../context/AuthContext";
import RoleHeader from "../components/RoleHeader";

export default function FarmerWishlist() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getFarmerWishlist(token);
        setRequests(data);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      }
    })();
  }, [token]);

  return (
    <>
      <RoleHeader />
      <div className="p-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Wishlisted Customer Requests</h2>

        {requests.length === 0 && <p>No wishlisted requests yet.</p>}

        <div className="grid gap-3">
          {requests.map((r) => (
            <div key={r._id} className="p-4 border rounded shadow">
              <div className="font-semibold">{r.product} — {r.quantity} {r.unit}</div>
              <div>State: {r.state}</div>
              <div>Location: {r.location}</div>
              <div>Phone: {r.phone}</div>
              <div>Email: {r.email}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
