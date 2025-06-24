import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './components/common/Loader';
import Layout from './components/common/Layout';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Product'));
const ProductDetail = lazy(() => import('./pages/Product/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Account = lazy(() => import('./pages/Account'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const NotFound = lazy(() => import('./pages/404'));
const Wishlist = lazy(() => import('./pages/Wishlist/index.jsx'));
const Contact = lazy(() => import('./pages/Contact/index.jsx'));
const CategoryPage = lazy(() => import('./pages/Category/index.jsx'));
const AllCategoriesPage = lazy(() => import('./pages/Category/AllCategories.jsx'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation.jsx'));

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Always render children, but redirect to login if not authenticated and trying to access a protected route
  if (!isAuthenticated) {
    // Save intended path for redirect after login
    const from = window.location.pathname;
    return <Navigate to={`/login?from=${encodeURIComponent(from)}`} replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public routes outside the main layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main app routes inside the layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="contact" element={<Contact />} />
          <Route path="category" element={<AllCategoriesPage />} />
          <Route path="category/:category" element={<CategoryPage />} />
          <Route path="checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />
          <Route path="account/*" element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          } />
          <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;