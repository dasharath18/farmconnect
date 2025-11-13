// client/src/pages/MyRequests.jsx
import React, { useEffect, useState } from "react";
import { getRequests, deleteRequest } from "../api/request";
import { useAuth } from "../context/AuthContext";
import RoleHeader from "../components/RoleHeader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MyRequests() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const data = await getRequests({ mine: "true" }, token);
      setRequests(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      await deleteRequest(id, token);
      setRequests(prev => prev.filter(r => r._id !== id));
      toast.success("Request deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <RoleHeader />
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Posted Requests</h2>
          <div className="flex gap-2">
            <button onClick={() => navigate("/customer/create-request")} className="bg-green-600 text-white px-3 py-1 rounded">Add Request</button>
            <button onClick={load} className="bg-gray-200 px-3 py-1 rounded">Refresh</button>
          </div>
        </div>

        {loading ? <div>Loading...</div> : (
          <>
            {requests.length === 0 && <div>No requests posted yet.</div>}

            <div className="grid gap-3">
              {requests.map(r => (
                <div key={r._id} className="p-4 border rounded shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg">{r.product} — {r.quantity} {r.unit}</div>
                      <div className="text-sm text-gray-600">State: {r.state || "N/A"} · Location: {r.location || "N/A"}</div>
                      <div className="text-sm mt-1">Contact: {r.phone || r.email || "N/A"}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => navigate(`/customer/requests/edit/${r._id}`)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(r._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
