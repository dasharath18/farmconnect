// client/src/pages/FarmerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import RoleHeader from "../components/RoleHeader";
import { Link } from "react-router-dom";

import { getRequests } from "../api/request";
import { getNotifications } from "../api/notification";

export default function FarmerDashboard() {
  const { user, logout, token } = useAuth();

  const [allRequests, setAllRequests] = useState([]);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRequests({}, token);
        setAllRequests(data);

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
          <Link
            to="/profile/edit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </Link>
          <Link to="/farmer/add-crop" className="bg-blue-500 text-white px-4 py-2 rounded" >
          Add Crop
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded shadow">
            <h3 className="text-sm text-gray-500">Total Customer Requests</h3>
            <p className="text-2xl font-bold">{allRequests.length}</p>
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
