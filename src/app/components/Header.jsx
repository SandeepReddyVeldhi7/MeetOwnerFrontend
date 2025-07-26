import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';

export default function Header({ onLoginClick }) {
  const { user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const wishlistItems = useSelector(state => state.wishlist.items);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header
      style={{
        backgroundColor: '#fff',
        padding: '1rem 1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      {/* Logo / Title */}
      <h1
        onClick={() => navigate('/')}
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          color: '#333'
        }}
      >
        🛒 All Products
      </h1>

      {/* Right Side Icons & Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Wishlist */}
        <div
          onClick={() => navigate('/wishlist')}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <FaHeart size={22} color="#e11d48" />
          {wishlistItems.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '0.75rem',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}
            >
              {wishlistItems.length}
            </span>
          )}
        </div>

        {/* Cart */}
        <div
          onClick={() => navigate('/cart')}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <FaShoppingCart size={22} color="#111827" />
          {totalCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '0.75rem',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}
            >
              {totalCount}
            </span>
          )}
        </div>

        
        </div>
    </header>
  );
}
