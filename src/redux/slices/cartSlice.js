import { createSlice } from '@reduxjs/toolkit';

// Helper to get user key for cart
function getCartKey(user) {
  if (user && user.email) {
    return `cart_${user.email}`;
  }
  return 'cart_guest';
}

// Load cart from localStorage for current user
function loadCart(user) {
  try {
    const key = getCartKey(user);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save cart to localStorage for current user
function saveCart(user, items) {
  try {
    const key = getCartKey(user);
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
}

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
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, loadCartForUser } =
  cartSlice.actions;

// Middleware to persist cart to localStorage on every cart change
export const persistCartMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  // Only persist on cart actions
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