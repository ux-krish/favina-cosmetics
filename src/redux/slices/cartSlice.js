import { createSlice } from '@reduxjs/toolkit';
import { loadCart, saveCart, clearCart as clearCartService } from '../../services/cartService';

const initialState = {
  items: [],
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    loadCartForUser: (state, action) => {
      state.items = loadCart(action.payload);
    },
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.quantity = quantity;
    },
    clearCart: (state, action) => {
      state.items = [];
      clearCartService(action?.payload);
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, loadCartForUser } =
  cartSlice.actions;

export const persistCartMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  if (
    action.type.startsWith('cart/') &&
    ['addToCart', 'removeFromCart', 'updateQuantity', 'clearCart'].some((type) => action.type.endsWith(type))
  ) {
    const user = state.auth.user;
    saveCart(user, state.cart.items);
  }
  return result;
};

export default cartSlice.reducer;