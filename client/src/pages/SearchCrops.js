import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addToWishlist, removeFromWishlist, getWishlist } from "../api/wishlist";
import CropCard from "../components/CropCard";
import RoleHeader from "../components/RoleHeader";

function SearchCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [processing, setProcessing] = useState({}); // track per-crop processing

  const [product, setProduct] = useState("");
  const [state, setState] = useState("");
  const [locationStr, setLocationStr] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [sort, setSort] = useState("");

  const locationHook = useLocation();
  const navigate = useNavigate();

  // Helper: extract crop id from a wishlist item (handles populated or plain id)
  const getCropIdFromWishlistItem = (w) => {
    if (!w) return null;
    if (typeof w.crop === "string") return w.crop;
    if (w.crop && w.crop._id) return w.crop._id;
    // if for some reason the wishlist item directly stores cropId in another field
    return null;
  };

const API = process.env.REACT_APP_API_URL;

// Fetch crops on search params change
useEffect(() => {
  const fetchCrops = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/api/crops${locationHook.search}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error fetching crops");
      setCrops(data);
    } catch (err) {
      setError(err.message || "Error fetching crops");
    } finally {
      setLoading(false);
    }
  };

  fetchCrops();
}, [locationHook.search]);

  // Fetch wishlist (if user logged in). If not authenticated, getWishlist may fail - ignore gracefully.
 useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setWishlist([]); // not logged in or not set yet
        return;
      }
      const items = await getWishlist();
      setWishlist(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Could not fetch wishlist:", err);
      setWishlist([]);
    }
  };

  fetchWishlist();
}, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (product) params.append("product", product);
    if (state) params.append("state", state);
    if (locationStr) params.append("location", locationStr);
    if (minQuantity) params.append("minQuantity", minQuantity);
    if (maxQuantity) params.append("maxQuantity", maxQuantity);
    if (sort) params.append("sort", sort);
    navigate(`/customer/search?${params.toString()}`);
  };

  const handleReset = () => {
    setProduct("");
    setState("");
    setLocationStr("");
    setMinQuantity("");
    setMaxQuantity("");
    setSort("");
    navigate(`/customer/search`);
  };

  const inWishlist = (cropId) => {
    return wishlist.some((w) => getCropIdFromWishlistItem(w) === cropId);
  };

  const findWishlistItemByCropId = (cropId) => {
    return wishlist.find((w) => getCropIdFromWishlistItem(w) === cropId);
  };

  const setProcessingFor = (cropId, value) => {
    setProcessing((prev) => {
      const next = { ...prev };
      if (value) next[cropId] = true;
      else delete next[cropId];
      return next;
    });
  };

const handleToggleWishlist = async (crop) => {
  if (!crop || !crop._id) return;
  const cropId = crop._id;
  const existing = findWishlistItemByCropId(cropId);
  try {
    setError("");
    setProcessingFor(cropId, true);

    if (existing) {
      // remove
      await removeFromWishlist(existing._id);
      setWishlist((prev) => prev.filter((w) => w._id !== existing._id));
    } else {
      // add
      try {
        const added = await addToWishlist(cropId);
        setWishlist((prev) => [added, ...prev]);
      } catch (e) {
        // If server says "Already in wishlist", refresh local wishlist
        if (e.message && e.message.toLowerCase().includes("already in wishlist")) {
          const refreshed = await getWishlist();
          setWishlist(Array.isArray(refreshed) ? refreshed : []);
        } else {
          throw e; // rethrow other errors
        }
      }
    }
  } catch (err) {
    setError(err?.message || "Error updating wishlist. Are you logged in?");
  } finally {
    setProcessingFor(cropId, false);
  }
};
  return (
    <>
      <RoleHeader/>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Crops</h2>

      <form onSubmit={handleSearch} className="grid gap-2 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <input
          className="border p-2 rounded"
          placeholder="Product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
        <input className="border p-2 rounded" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
        <input
          className="border p-2 rounded"
          placeholder="Location"
          value={locationStr}
          onChange={(e) => setLocationStr(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Min Quantity"
          value={minQuantity}
          onChange={(e) => setMinQuantity(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Max Quantity"
          value={maxQuantity}
          onChange={(e) => setMaxQuantity(e.target.value)}
        />
        <select className="border p-2 rounded" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
        <div className="flex gap-2 col-span-full mt-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Search
          </button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading crops...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : crops.length === 0 ? (
        <p>No crops found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((crop) => {
  const cropId = crop._id;
  const isInWishlist = inWishlist(cropId);
  const isProcessing = !!processing[cropId];

  // navigate to a crop detail page (create one later if you want)
  const onView = () => {
    navigate(`/crop/${cropId}`);
  };

  return (
    <CropCard
      key={cropId}
      crop={crop}
      onView={onView}
      onWishlist={() => handleToggleWishlist(crop)}
      isInWishlist={isInWishlist}
      isProcessing={isProcessing}
    />
  );
})}
        </div>
      )}
    </div>
      </>
  );
}

export default SearchCrops;
