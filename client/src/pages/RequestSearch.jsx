import React, { useEffect, useState, useContext } from "react";
import { getRequests, wishlistRequest } from "../api/request";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import RoleHeader from "../components/RoleHeader";

const RequestSearch = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getRequests({}, token);
        if (!cancelled) setRequests(data);
      } catch (err) {
        toast.error("Could not load requests");
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const handleWishlist = async (id) => {
    try {
      await wishlistRequest(id, token);
      toast.success("Added to wishlist");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Could not wishlist");
    }
  };

  return (
    <>
          <RoleHeader />
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Customer Requests</h2>
      {loading ? <div>Loading...</div> : (
        <div className="grid gap-3">
          {requests.map(r => (
            <div key={r._id} className="card p-3">
              <div><strong>{r.product}</strong> — {r.quantity} {r.unit}</div>
              <div>Location: {r.location || r.state || "N/A"}</div>
              <div>Posted by: {r.customer?.name || "Customer"}</div>
              <div>Contact: {r.customer?.phone || r.customer?.email || "N/A"}</div>
              <div className="mt-2">
                <button onClick={() => handleWishlist(r._id)} className="btn">Add to wishlist</button>
              </div>
            </div>
          ))}
          {requests.length === 0 && <div>No requests found</div>}
        </div>
      )}
    </div>
    </>
  );
};

export default RequestSearch;
