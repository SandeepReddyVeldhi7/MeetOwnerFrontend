import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import Header from "./app/components/Header";
import LoginModal from "./app/components/LoginModal";
import { useState } from "react";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { Toaster } from "react-hot-toast";

function App() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
   <BrowserRouter>
  <div className=" bg-gray-50">
      <Toaster position="top-right" />
    <Header onLoginClick={() => setLoginOpen(true)} />

    <LoginModal
      isOpen={loginOpen}
      onClose={() => setLoginOpen(false)}
    />

    <Routes>
      <Route path="/" element={<ProductListPage />} />
      <Route
        path="/cart"
        element={<CartPage onLoginTrigger={() => setLoginOpen(true)} />}
      />
      <Route path="/wishlist" element={<WishlistPage/>} />
  <Route path="/product/:id" element={<ProductDetailsPage />} />
    </Routes>
  </div>
</BrowserRouter>

  );
}

export default App;
