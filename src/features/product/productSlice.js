import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../services/api';

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/products');
    
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to load products');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/search',
  async (query, thunkAPI) => {
    try {
      const res = await api.get(`/api/products/search?q=${query}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Search failed');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    searchSuggestions: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllProducts.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchSuggestions = action.payload;
      });
  }
});

export default productSlice.reducer;
 