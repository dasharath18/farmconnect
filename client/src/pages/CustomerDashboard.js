// client/src/pages/CustomerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RoleHeader from "../components/RoleHeader";

import { getRequests } from "../api/request";
import { getNotifications } from "../api/notification";

export default function CustomerDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [myRequests, setMyRequests] = useState([]);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const reqData = await getRequests({ mine: "true" }, token);
        setMyRequests(reqData);

        const notifData = await getNotifications(token);
        setNotifs(notifData);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  return (
    <>
      <RoleHeader />

      <main className="container mx-auto px-6 py-6">
        <h1 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h1>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => navigate("/profile/edit")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/customer/create-request")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Post New Request
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded shadow">
            <h3 className="text-sm text-gray-500">Total Requests</h3>
            <p className="text-2xl font-bold">{myRequests.length}</p>
          </div>

          <div className="p-4 border rounded shadow">
            <h3 className="text-sm text-gray-500">Unread Notifications</h3>
            <p className="text-2xl font-bold">
              {notifs.filter((n) => !n.read).length}
            </p>
          </div>

          <div className="p-4 border rounded shadow">
            <h3 className="text-sm text-gray-500">Total Notifications</h3>
            <p className="text-2xl font-bold">{notifs.length}</p>
          </div>
        </div>
      </main>
    </>
  );
}
