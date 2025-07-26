import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../features/product/productSlice";
import { addToCart, removeFromCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api";

export default function ProductListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const { list: products } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 12;

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllProducts()).finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (search.length > 1) {
        try {
          const res = await api.get(`/products/search?q=${search}`);
          if (Array.isArray(res.data)) {
            setSuggestions(res.data);
          } else {
            setSuggestions([]); // fallback if API returns an error object
          }
        } catch (err) {
          console.error("Failed to fetch suggestions", err);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const isWishlisted = (productId) =>
    wishlistItems.some((item) => item.id === productId);

  const getQuantity = (productId) => {
    const item = cartItems.find((item) => item.productId.id === productId);
    return item ? item.quantity : 0;
  };

  const handleIncrease = (product) => {
    dispatch(addToCart({ productId: product, quantity: 1 }));
    toast.success(`${product.title} added to cart`);
  };

  const handleDecrease = (product) => {
    const existing = cartItems.find((item) => item.productId.id === product.id);
    if (existing?.quantity > 1) {
      dispatch(addToCart({ productId: product, quantity: -1 }));
    } else {
      dispatch(removeFromCart(product.id));
    }
  };
  const handlePageChange = (newPage) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setPageLoading(false);
    }, 400); // adjust delay as needed
  };

  const iconButtonStyle = {
    fontSize: "1.25rem",
    background: "none",
    border: "none",
    cursor: "pointer",
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          fontSize: "1.5rem",
          color: "#2563eb",
        }}
      >
        Loading products...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          🛍️ Explore Products
        </h1>

        {/* Search Input */}
        {/* Search Input */}
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto 2.5rem",
            position: "relative",
          }}
        >
          <input
            style={{
              width: "100%",
              border: "1px solid #ccc",
              padding: "0.75rem 2.5rem 0.75rem 2.5rem", // space for icons
              borderRadius: "6px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              outline: "none",
            }}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* 🔍 Icon (left) */}
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "0.75rem",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              fontSize: "1rem",
              color: "#888",
            }}
          >
            🔍
          </span>

          {/*  Clear button (right) */}
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setSuggestions([]);
              }}
              style={{
                position: "absolute",
                top: "50%",
                right: "0.75rem",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                fontSize: "1rem",
                cursor: "pointer",
                color: "#888",
              }}
              aria-label="Clear search"
            >
              ❌
            </button>
          )}

          {/* Suggestions Dropdown */}
          {search && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                zIndex: 20,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                width: "100%",
                marginTop: "0.25rem",
                borderRadius: "6px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                maxHeight: "240px",
                overflowY: "auto",
                fontSize: "0.875rem",
              }}
            >
              {Array.isArray(suggestions) && suggestions.length > 0 ? (
                suggestions.map((product) => (
                  <li
                    key={product.id}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setSuggestions([]);
                      setSearch("");
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#e5f0ff")
                    }
                    onMouseOut={(e) => (e.currentTarget.style.background = "")}
                  >
                    🔍 {product.title}
                  </li>
                ))
              ) : (
                <li
                  style={{
                    padding: "0.5rem 1rem",
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  No products found.
                </li>
              )}
            </ul>
          )}
        </div>

        

     
       {/* Product Grid with shimmer loader */}
<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  }}
>
  {pageLoading
    ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
        <div
          key={index}
          style={{
            margin: "1rem",
            width: "200px",
            height: "280px",
            borderRadius: "8px",
            backgroundColor: "#e5e7eb",
            animation: "pulse 1.2s infinite ease-in-out",
          }}
        />
      ))
    : paginatedProducts.map((product) => (
        <div
          key={product.id}
          style={{
            margin: "1rem",
            width: "200px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <div style={{ position: "relative" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleWishlist(product));
                const isInWishlist = wishlistItems.some(
                  (item) => item.id === product.id
                );
                toast.success(
                  isInWishlist
                    ? `${product.title} removed from wishlist`
                    : `${product.title} added to wishlist`
                );
              }}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                color: "red",
                fontSize: "1.25rem",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isWishlisted(product.id) ? <FaHeart /> : <FaRegHeart />}
            </button>

            <div
              style={{
                height: "176px",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                loading="lazy"
                src={product.images?.[0]}
                alt={product.title}
                width="160"
                height="160"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <h3
              style={{
                fontWeight: "600",
                fontSize: "0.9rem",
                color: "#1f2937",
                height: "2.5rem",
                overflow: "hidden",
              }}
            >
              {product.title}
            </h3>
            <p
              style={{
                color: "green",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              ₹{product.price}
            </p>

            {getQuantity(product.id) === 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncrease(product);
                }}
                style={{
                  marginTop: "0.5rem",
                  width: "100%",
                  backgroundColor: "#2563eb",
                  color: "white",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Add to Cart
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  backgroundColor: "#f3f4f6",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecrease(product);
                  }}
                  style={{ fontSize: "1.25rem", background: "none", border: "none", cursor: "pointer", color: "red" }}
                >
                  −
                </button>
                <span>{getQuantity(product.id)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncrease(product);
                  }}
                  style={{ fontSize: "1.25rem", background: "none", border: "none", cursor: "pointer", color: "green" }}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
</div>

{/* Pulse animation style */}
<style>
  {`
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
  `}
</style>


        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: currentPage === 1 ? "#d1d5db" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>

            <span style={{ padding: "0.5rem 1rem", fontWeight: "bold" }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor:
                  currentPage === totalPages ? "#d1d5db" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
