import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../api/wishlist";
import CropCard from "../components/CropCard";
import { useNavigate } from "react-router-dom"; 
import RoleHeader from "../components/RoleHeader";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState({});
  const navigate = useNavigate();

  useEffect(() => 
  {
    (async () => 
    {
      try 
      {
        setLoading(true);
        const data = await getWishlist();
        // expect an array of wishlist items { _id, crop: {...} }
        setItems(Array.isArray(data) ? data : []);
      } 
      catch (err) 
      {
        setError(err?.message || "Failed to load wishlist");
      } 
      finally 
      {
        setLoading(false);
      }
    })();
  }, []);

  const handleRemove = async (wishlistId, cropId) => 
  {
    try 
    {
      setProcessing((p) => ({ ...p, [wishlistId || cropId]: true }));
      await removeFromWishlist(wishlistId);
      setItems((prev) => prev.filter((w) => w._id !== wishlistId));
    } 
    catch (err) 
    {
      setError(err?.message || "Failed to remove item");
    } 
    finally 
    {
      setProcessing((p) => 
      {
        const copy = { ...p };
        delete copy[wishlistId || cropId];
        return copy;
      });
    }
  };

  if (loading) return <div className="p-4">Loading wishlist...</div>;

  return (
    <>
      <RoleHeader/>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Wishlist</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {items.length === 0 ? (
        <p>No items in your wishlist yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((w) => {
  const crop = w.crop || {};
  const wid = w._id;
  const isProcessing = !!processing[wid];

  const onView = () => navigate(`/crop/${crop._id || crop.id}`);

  return (
    <CropCard
      key={wid}
      crop={crop}
      onView={onView}
      onWishlist={() => handleRemove(wid, crop._id)} // reuse your remove handler
      isInWishlist={true}
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
