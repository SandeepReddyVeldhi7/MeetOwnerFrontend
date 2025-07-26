import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const saved = JSON.parse(localStorage.getItem("cartItems") || "[]");

export const syncCartToBackend = createAsyncThunk(
  "cart/syncToBackend",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token || localStorage.getItem("token");
    const rawItems = state.cart.items;

    // 🧹 Clean the cart to remove complex objects or dummy product structures
    const cleanedItems = rawItems.map((item) => ({
      productId: item.productId.id  ,
      quantity: item.quantity,
    }));

    await api.post(
      "/cart/add",
      { items: cleanedItems },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // localStorage.removeItem("cartItems");
    return cleanedItems;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: saved,
  },
  reducers: {
   addToCart: (state, action) => {
  const { productId, quantity } = action.payload;
  const existing = state.items.find(
    (i) =>
      i.productId.id === productId.id || // when productId is an object
      i.productId === productId           // when productId is just an ID (number/string)
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    state.items.push({ productId, quantity });
  }

  localStorage.setItem("cartItems", JSON.stringify(state.items));
},

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) =>
  (i.productId.id || i.productId) !== action.payload

      );
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(syncCartToBackend.fulfilled, (state) => {
     
    });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
