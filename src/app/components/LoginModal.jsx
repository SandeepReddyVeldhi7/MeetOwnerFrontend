import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth/authSlice";
export default function LoginModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging in...");
    setLoading(true);

    try {
      const res = await api.post("/user/login", { email, password });
      const { token, user } = res.data;
      dispatch(login({ token, user }));

      //  Sync localStorage cart to DB if present
      const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
     if (localCart.length > 0) {
  try {
   const cleanedCart = localCart.map(item => ({
  productId: item.productId,
  quantity: item.quantity
}));

await api.post('/cart/add', { items: cleanedCart }, {
  headers: { Authorization: `Bearer ${token}` }
});
    localStorage.removeItem('cartItems'); //  this line clears guest cart
  } catch (syncErr) {
    console.error("Cart sync failed", syncErr);
    toast.error("Failed to sync cart to account");
  }
}


      toast.success("Login successful!", { id: toastId });
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating account...");
    setLoading(true);
    try {
      await api.post("/user/register", { email, password });
      toast.success("Account created! Please log in.", { id: toastId });
      setStep("login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const toastId = toast.loading("Sending OTP...");
    setLoading(true);
    try {
      await api.post("/user/forgot-password", { email });
      toast.success("OTP sent to email", { id: toastId });
      setStep("otp");
    } catch {
      toast.error("Email not found", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const toastId = toast.loading("Resetting password...");
    setLoading(true);
    try {
      await api.post("/user/reset-password", { email, otp, newPassword });
      toast.success("Password reset! Please login.", { id: toastId });
      setStep("login");
    } catch {
      toast.error("Invalid or expired OTP", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          &times;
        </button>

        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {
            {
              login: "Login",
              signup: "Sign Up",
              forgot: "Forgot Password",
              otp: "Reset Password",
            }[step]
          }
        </h2>

        {step === "login" && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: loading ? "#ccc" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            <p style={{ marginTop: "0.75rem", textAlign: "center" }}>
              <span
                onClick={() => setStep("forgot")}
                style={{
                  color: "#2563eb",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Forgot password?
              </span>
            </p>
            <p style={{ textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <span
                onClick={() => setStep("signup")}
                style={{
                  color: "#2563eb",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Sign up
              </span>
            </p>
          </form>
        )}

        {step === "signup" && (
          <form onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: loading ? "#ccc" : "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              Already have an account?{" "}
              <span
                onClick={() => setStep("login")}
                style={{
                  color: "#2563eb",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Log in
              </span>
            </p>
          </form>
        )}

        {step === "forgot" && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <button
              onClick={handleForgotPassword}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: loading ? "#ccc" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <span
                onClick={() => setStep("login")}
                style={{
                  color: "#2563eb",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Back to login
              </span>
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <button
              onClick={handleResetPassword}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: loading ? "#ccc" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
