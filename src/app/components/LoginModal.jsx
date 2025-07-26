import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function LoginModal({ isOpen, onClose }) {
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Logging in...');
    try {
      const res = await api.post('/user/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);

      // Sync localStorage cart to backend
      const localCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      for (let item of localCart) {
        await api.post('/cart/add', item, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      localStorage.removeItem('cartItems');

      toast.dismiss();
      toast.success('Login successful!');
      setLoading(false);
      onClose();
    } catch (err) {
      toast.dismiss();
      toast.error('Invalid credentials');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    toast.loading('Sending OTP...');
    try {
      await api.post('/user/forgot-password', { email });
      setStep('otp');
      toast.dismiss();
      toast.success('OTP sent to email');
    } catch {
      toast.dismiss();
      toast.error('Email not found');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    toast.loading('Resetting password...');
    try {
      await api.post('/user/reset-password', { email, otp, newPassword });
      setStep('login');
      toast.dismiss();
      toast.success('Password reset! Please login.');
    } catch {
      toast.dismiss();
      toast.error('Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>{step === 'login' ? 'Login' : step === 'forgot' ? 'Forgot Password' : 'Reset Password'}</h2>

        {step === 'login' && (
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '6px' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '6px' }} />
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', backgroundColor: loading ? '#ccc' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            <p style={{ marginTop: '0.75rem', textAlign: 'center' }}>
              <span onClick={() => setStep('forgot')} style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>Forgot password?</span>
            </p>
          </form>
        )}

        {step === 'forgot' && (
          <>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '6px' }} />
            <button onClick={handleForgotPassword} disabled={loading} style={{ width: '100%', padding: '0.75rem', backgroundColor: loading ? '#ccc' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <p style={{ marginTop: '0.75rem', textAlign: 'center' }}>
              <span onClick={() => setStep('login')} style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>Back to login</span>
            </p>
          </>
        )}

        {step === 'otp' && (
          <>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '6px' }} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '6px' }} />
            <button onClick={handleResetPassword} disabled={loading} style={{ width: '100%', padding: '0.75rem', backgroundColor: loading ? '#ccc' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
