import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to get orders from localStorage
const getOrdersFromStorage = () => {
  if (typeof window !== 'undefined') {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  }
  return [];
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { getState }) => {
    // In a real app, you would send this to your API
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      status: 'processing',
    };
    
    // Save to localStorage
    const currentOrders = getOrdersFromStorage();
    const updatedOrders = [...currentOrders, newOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    return newOrder;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: getOrdersFromStorage(),
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;