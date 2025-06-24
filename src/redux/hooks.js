import { useDispatch, useSelector } from 'react-redux';

// Typed hooks for Redux usage in components

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Optional: create a custom hook for selecting a specific slice
export const useAuth = () => useAppSelector((state) => state.auth);
export const useCart = () => useAppSelector((state) => state.cart);
export const useOrder = () => useAppSelector((state) => state.order);

