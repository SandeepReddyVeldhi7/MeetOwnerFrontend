import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function WishlistPage() {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const navigate = useNavigate();

  if (wishlistItems.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "5rem", color: "#4B5563" }}>
        <p style={{ fontSize: "1rem" }}>No items in wishlist 🥲</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          color: "#111827",
        }}
      >
        ❤️ Your Wishlist
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: "190px",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                marginTop: "0.75rem",
                color: "#1f2937",
              }}
            >
              {product.title}
            </h3>

            <p
              style={{
                color: "green",
                fontWeight: "bold",
                fontSize: "1rem",
                marginTop: "0.25rem",
              }}
            >
              ₹{product.price}
            </p>

            <button
              onClick={() => navigate(`/product/${product.id}`)}
              style={{
                marginTop: "0.75rem",
                fontSize: "0.875rem",
                backgroundColor: "#ef4444",
                color: "#fff",
                padding: "0.4rem 0.8rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                alignSelf: "start",
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
