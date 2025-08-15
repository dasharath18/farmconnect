import React from "react";
export default function CropCard({ crop = {}, onView = () => {}, onWishlist = () => {}, isInWishlist = false, isProcessing = false }) {
  return (
    <div className="crop-card border rounded-lg overflow-hidden bg-white shadow transition-transform transform hover:-translate-y-2 hover:shadow-xl">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{crop.product || crop.name || "Unnamed crop"}</h3>

          <button
            onClick={() => onWishlist(crop)}
            disabled={isProcessing}
            className="ml-2 p-1 rounded-full hover:scale-105 transition-transform"
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <span style={{ fontSize: 18 }}>{isProcessing ? "⏳" : (isInWishlist ? "❤️" : "🤍")}</span>
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-2">{(crop.description && crop.description.slice(0, 90)) || crop.location || ""}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
                  <p><strong>Quantity:</strong> {crop.quantity} {crop.unit}</p>
      <p><strong>Location:</strong> {crop.location}, {crop.state}</p>
      <p><strong>Contact:</strong> {crop.phone}</p>
      <p><strong>Email:</strong> {crop.email}</p>
      <p className="text-sm text-gray-500 mt-2">Posted on: {new Date(crop.dateAdded).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => onWishlist(crop)} disabled={isProcessing} className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-sm">
              {isInWishlist ? "In wishlist" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
