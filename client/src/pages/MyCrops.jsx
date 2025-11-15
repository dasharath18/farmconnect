import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RoleHeader from "../components/RoleHeader";

const API = process.env.REACT_APP_API_URL;

export default function MyCrops() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/crops/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCrops(res.data))
      .catch((err) => console.log("MyCrops load error:", err));
  }, [token]);

  const handleEdit = (crop) => {
    navigate(`/farmer/edit/${crop._id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      axios
        .delete(`${API}/api/crops/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setCrops((prev) => prev.filter((crop) => crop._id !== id));
          alert("Crop deleted successfully.");
        })
        .catch((err) => {
          console.error("Delete crop error:", err);
          alert("Failed to delete crop.");
        });
    }
  };

  return (
    <>
      <RoleHeader />
      <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {crops.length === 0 ? (
          <p>No crops added yet.</p>
        ) : (
          crops.map((crop) => (
            <div
              key={crop._id}
              className="border rounded-lg overflow-hidden bg-white shadow transition-transform transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold">
                    {crop.product || "Unnamed crop"}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  {(crop.description && crop.description.slice(0, 90)) ||
                    crop.location ||
                    ""}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <p><strong>Quantity:</strong> {crop.quantity} {crop.unit}</p>
                    <p><strong>Location:</strong> {crop.location}, {crop.state}</p>
                    <p><strong>Contact:</strong> {crop.phone}</p>
                    <p><strong>Email:</strong> {crop.email}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Posted on: {new Date(crop.dateAdded).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(crop)}
                      className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(crop._id)}
                      className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import RoleHeader from "../components/RoleHeader";

// export default function MyCrops() {
//   const { token } = useAuth();
//   const navigate = useNavigate();
//   const [crops, setCrops] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/crops/my", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setCrops(res.data))
//       .catch((err) => console.log(err));
//   }, [token]);

//   const handleEdit = (crop) => {
//     navigate(`/farmer/edit/${crop._id}`);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this crop?")) {
//       axios
//         .delete(`http://localhost:5000/api/crops/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then(() => {
//           setCrops(crops.filter((crop) => crop._id !== id));
//           alert("Crop deleted successfully.");
//         })
//         .catch((err) => {
//           console.error(err);
//           alert("Failed to delete crop.");
//         });
//     }
//   };

//   return (
//     <>
//       <RoleHeader />
//       <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {crops.length === 0 ? (
//           <p>No crops added yet.</p>
//         ) : (
//           crops.map((crop) => (
//             <div
//               key={crop._id}
//               className="border rounded-lg overflow-hidden bg-white shadow transition-transform transform hover:-translate-y-1 hover:shadow-xl"
//             >
//               <div className="p-4">
//                 <div className="flex items-start justify-between">
//                   <h3 className="text-lg font-semibold">
//                     {crop.product || "Unnamed crop"}
//                   </h3>
//                 </div>

//                 <p className="text-sm text-gray-600 mt-2">
//                   {(crop.description && crop.description.slice(0, 90)) ||
//                     crop.location ||
//                     ""}
//                 </p>

//                 <div className="mt-4 flex items-center justify-between">
//                   <div className="text-sm text-gray-700">
//                     <p>
//                       <strong>Quantity:</strong> {crop.quantity} {crop.unit}
//                     </p>
//                     <p>
//                       <strong>Location:</strong> {crop.location}, {crop.state}
//                     </p>
//                     <p>
//                       <strong>Contact:</strong> {crop.phone}
//                     </p>
//                     <p>
//                       <strong>Email:</strong> {crop.email}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-2">
//                       Posted on:{" "}
//                       {new Date(crop.dateAdded).toLocaleDateString()}
//                     </p>
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEdit(crop)}
//                       className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 text-sm"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(crop._id)}
//                       className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </>
//   );
// }
