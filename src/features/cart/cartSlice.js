// features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const saved = JSON.parse(localStorage.getItem('cartItems') || '[]');

export const syncCartToBackend = createAsyncThunk(
  'cart/syncToBackend',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token || localStorage.getItem('token');
    const items = state.cart.items;

    await axios.post(
      'http://localhost:5000/api/cart/add',
      { items },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    localStorage.removeItem('cartItems');
    return items;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: saved,
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const existing = state.items.find((i) => i.productId.id === productId.id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, quantity });
      }

      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId.id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(syncCartToBackend.fulfilled, (state) => {
      state.items = [];
    });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
