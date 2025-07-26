import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function OrderSuccess() {
  useEffect(() => {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <h1>🎉 Thank You!</h1>
      <p>Your order has been placed successfully.</p>
      <button onClick={() => window.location.href = '/'}>Go to Home</button>
    </div>
  );
}
