import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  syncCartToBackend,
  addToCart,
  removeFromCart,
  clearCart,
} from "../features/cart/cartSlice";
import { toast } from "react-hot-toast";
import api from "../services/api";
import confetti from 'canvas-confetti';

export default function CartPage({ onLoginTrigger }) {
  console.log("onLoginTrigger", onLoginTrigger);
  const { user, token } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  const handleProceed = async () => {
    if (!token) {
      console.log("No token, triggering login modal.");
      onLoginTrigger();
      return;
    }

    console.log("Token found. Proceeding to payment...");

    try {
      await dispatch(syncCartToBackend());
      console.log(
        "import.meta.env.VITE_RAZORPAY_KEY_ID,",
        import.meta.env.VITE_RAZORPAY_KEY_ID
      );
      const cleanedItems = items.map(i => ({
  productId: i.productId._id || i.productId.id || i.productId,  // get ID only
  quantity: i.quantity
}));

const res = await api.post(
  "/payment/razorpay-order",
  { amount: total * 100, cartItems: cleanedItems },
  { headers: { Authorization: `Bearer ${token}` } }
);


      console.log("Razorpay order created:", res.data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "MyShop",
        description: "Order Payment",
        order_id: res.data.id,
       handler: async function (response) {
  let verifyRes;
  try {
    verifyRes = await api.post("/payment/verify-payment", {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Backend verified:", verifyRes.data);
  } catch (err) {
    console.error("❌ Backend error:", err);
    toast.error("Payment verification failed");
    return;
  }

  try {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    dispatch(clearCart());
    toast.success("🎉 Order placed successfully!");
    setTimeout(() => navigate("/order-success"), 1500);
  } catch (err) {
    console.error("❌ Frontend post-verification error:", err);
    toast.error("Post-verification failed");
  }
}
,

        prefill: {
          name: user?.name || "Guest",
          email: user?.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed");
    }
  };

  const handleIncrease = (product) => {
    dispatch(addToCart({ productId: product, quantity: 1 }));
  };

  const handleDecrease = (product) => {
    if (product.quantity > 1) {
      dispatch(addToCart({ productId: product.productId, quantity: -1 }));
    } else {
      dispatch(removeFromCart(product.productId.id));
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          color: "#111827",
        }}
      >
        🛒 Your Cart
      </h2>

      {items.length === 0 ? (
        <p style={{ fontSize: "1rem", color: "#6b7280" }}>
          Your cart is empty.
        </p>
      ) : (
        <>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {items.map((item) => (
              <div
                key={item.productId.id}
                style={{
                  display: "flex",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.productId.images?.[0]}
                    alt={item.productId.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "600" }}>
                    {item.productId.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    ₹{item.productId.price} × {item.quantity}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    padding: "0.25rem 0.5rem",
                  }}
                >
                  <button
                    onClick={() => handleDecrease(item)}
                    style={{
                      fontSize: "1.25rem",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#dc2626",
                    }}
                  >
                    −
                  </button>
                  <span style={{ minWidth: "20px", textAlign: "center" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(item.productId)}
                    style={{
                      fontSize: "1.25rem",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#16a34a",
                    }}
                  >
                    +
                  </button>
                </div>

                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    marginLeft: "1rem",
                    minWidth: "80px",
                    textAlign: "right",
                  }}
                >
                  ₹{(item.productId.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              backgroundColor: "#f9fafb",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>
              Order Summary
            </h3>
            <p style={{ marginTop: "0.75rem", fontSize: "1rem" }}>
              <strong>Total:</strong> ₹{total.toFixed(2)}
            </p>

            <button
              onClick={handleProceed}
              style={{
                marginTop: "1rem",
                width: "100%",
                backgroundColor: "#16a34a",
                color: "#fff",
                padding: "0.75rem",
                border: "none",
                borderRadius: "6px",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Proceed to Pay
            </button>
          </div>
        </>
      )}
    </div>
  );
}
