import { createSlice } from '@reduxjs/toolkit';

// Helper function to get orders from localStorage
const getOrdersFromStorage = () => {
  if (typeof window !== 'undefined') {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  }
  return [];
};

// Async thunk (not using createAsyncThunk)
export const createOrderThunk = (orderData) => async (dispatch) => {
  dispatch(orderSlice.actions.createOrderPending());
  try {
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      status: 'processing',
    };
    const currentOrders = getOrdersFromStorage();
    const updatedOrders = [...currentOrders, newOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    dispatch(orderSlice.actions.createOrderFulfilled(newOrder));
  } catch (error) {
    dispatch(orderSlice.actions.createOrderRejected(error.message));
  }
};

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: getOrdersFromStorage(),
    status: 'idle',
    error: null,
  },
  reducers: {
    createOrderPending: (state) => {
      state.status = 'loading';
    },
    createOrderFulfilled: (state, action) => {
      state.status = 'succeeded';
      state.orders.push(action.payload);
    },
    createOrderRejected: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export default orderSlice.reducer;