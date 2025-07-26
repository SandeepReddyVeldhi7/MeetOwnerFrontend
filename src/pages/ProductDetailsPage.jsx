import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts } from '../features/product/productSlice';
import { addToCart, removeFromCart } from '../features/cart/cartSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: products } = useSelector((state) => state.products);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(false);

  // Load products if not available
  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);
      dispatch(fetchAllProducts()).finally(() => setLoading(false));
    }
  }, [dispatch, products]);

  // Normalize ID (ensure comparison is safe)
  const productId = parseInt(id);
  const product = products.find((p) => p.id === productId);
  const isWishlisted = wishlistItems.some((item) => item.id === productId);
  const quantity =
    cartItems.find((item) => item.productId.id === productId)?.quantity || 0;

  // Loading / Not found
  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading product...</p>;
  }

  if (!product) {
    return <p style={{ textAlign: 'center', marginTop: '4rem' }}>Product not found.</p>;
  }

  // Handlers
  const handleAdd = () => dispatch(addToCart({ productId: product, quantity: 1 }));
  const handleRemove =
    quantity > 1
      ? () => dispatch(addToCart({ productId: product, quantity: -1 }))
      : () => dispatch(removeFromCart(product.id));
  const handleWishlistToggle = () => dispatch(toggleWishlist(product));

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '1rem',
          background: 'none',
          border: 'none',
          color: '#2563eb',
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Image */}
        <div
          style={{
            flex: '1 1 300px',
            backgroundColor: '#f3f4f6',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Details */}
        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{product.title}</h1>
          <p style={{ fontSize: '1.25rem', color: 'green', fontWeight: 'bold' }}>
            ₹{product.price}
          </p>
          <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>
            {product.description || 'No description available.'}
          </p>

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'red',
              fontSize: '1rem',
            }}
          >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>

          {/* Add to cart or quantity controls */}
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Add to Cart
            </button>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              <button
                onClick={handleRemove}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '1.25rem',
                  backgroundColor: '#e5e7eb',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={handleAdd}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '1.25rem',
                  backgroundColor: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
