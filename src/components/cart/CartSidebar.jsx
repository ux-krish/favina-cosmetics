import { createGlobalStyle, styled } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useCart, useAuth } from '../../redux/hooks';
import { toggleCart, removeFromCart, updateQuantity, clearCart, addToCart } from '../../redux/slices/cartSlice';
import Button from '../common/Button';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useMemo } from 'react';
import productData from '../../data/product.json';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css';

const CartSidebar = () => {
  const dispatch = useAppDispatch();
  const { items, isCartOpen } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const [cartCount, setCartCount] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Close cart when clicking outside the sidebar
  useEffect(() => {
    if (!isCartOpen) return;
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        dispatch(toggleCart());
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isCartOpen, dispatch]);

  // Helper to get/set cart for current user in localStorage
  const getUserCart = () => {
    if (!user?.id) return items;
    const allCarts = JSON.parse(localStorage.getItem('carts') || '{}');
    const arr = Array.isArray(allCarts[user.id]) ? allCarts[user.id] : [];
    return arr;
  };
  const setUserCart = (cartItems) => {
    if (!user?.id) return;
    const allCarts = JSON.parse(localStorage.getItem('carts') || '{}');
    allCarts[user.id] = cartItems;
    localStorage.setItem('carts', JSON.stringify(allCarts));
    // Dispatch a custom event for instant cart count update
    window.dispatchEvent(new Event('cartChanged'));
  };

  // Use user cart if logged in, fallback to redux cart for guest
  const cartItems = isAuthenticated ? getUserCart() : items;

  // --- Quick Buy: Exclude products already in cart ---
  // Memoize quickBuyProducts so Swiper doesn't reset on cart quantity update
  const quickBuyProducts = useMemo(() => {
    return productData.products
      .filter(p => !cartItems.some(item => item.id === p.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  // Only change when cartItems' ids change (not quantity)
  }, [JSON.stringify(cartItems.map(i => i.id).sort())]);

  // Keep Swiper instance stable
  const quickBuySwiperRef = useRef(null);

  // Update cart count from localStorage (always accurate)
  useEffect(() => {
    const updateCartCount = () => {
      if (isAuthenticated && user?.id) {
        const allCarts = JSON.parse(localStorage.getItem('carts') || '{}');
        const arr = Array.isArray(allCarts[user.id]) ? allCarts[user.id] : [];
        setCartCount(arr.length);
      } else {
        setCartCount(items.length);
      }
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartChanged', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartChanged', updateCartCount);
    };
    // eslint-disable-next-line
  }, [isAuthenticated, user?.id, items.length]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handler for add to cart (quick buy, upsell, or product card)
  const handleAddToCart = (product) => {
    let updatedCart;
    const exists = cartItems.find(item => item.id === product.id);
    if (exists) {
      updatedCart = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    if (isAuthenticated) {
      setUserCart(updatedCart);
    }
    dispatch(addToCart({ ...product, quantity: 1 }));
    window.dispatchEvent(new Event('cartChanged'));
    // No need to manually update quickBuyProducts, component will re-render due to cartItems change
  };

  // Handler to update quantity or remove if 0
  const handleQuantityChange = (id, quantity) => {
    let updatedCart;
    if (quantity <= 0) {
      updatedCart = cartItems.filter(item => item.id !== id);
    } else {
      updatedCart = cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    }
    if (isAuthenticated) {
      setUserCart(updatedCart);
    }
    // Always update redux for UI sync
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
    window.dispatchEvent(new Event('cartChanged'));
  };

  // Handler for clearing cart
  const handleClearCart = () => {
    if (isAuthenticated) {
      setUserCart([]);
    }
    dispatch(clearCart());
    window.dispatchEvent(new Event('cartChanged'));
  };

  // Handler for navigating to product details from upsell or quick buy
  const navigateToProduct = (id, e) => {
    // Prevent navigation if clicking on add button
    if (
      e.target.closest('button') ||
      e.target.closest('[role="button"]')
    ) {
      return;
    }
    dispatch(toggleCart());
    navigate(`/products/${id}`);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CartContainer
            ref={sidebarRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
          >
            <CartHeader>
              <h3>Your Cart ({cartCount})</h3>
              <CloseButton onClick={() => dispatch(toggleCart())}>×</CloseButton>
            </CartHeader>
            
            <CartItems>
              {cartItems.length === 0 ? (
                <>
                  <EmptyCart>Your cart is empty</EmptyCart>
                  <ShopNowBtn
                    type="button"
                    onClick={() => {
                      dispatch(toggleCart());
                      navigate('/products');
                    }}
                  >
                    Shop Now
                  </ShopNowBtn>
                  {/* Removed Recommended for you section */}
                </>
              ) : (
                cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => handleQuantityChange(item.id, 0)}
                    onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                  />
                ))
              )}
            </CartItems>
            
            <CartFooter>
              <Total>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </Total>
              <ButtonRow>
                <CartActionButton
                  onClick={() => {
                    dispatch(toggleCart());
                    // No need to sync here, already synced on add/remove
                    navigate('/checkout');
                  }}
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </CartActionButton>
                <CartActionButton
                  $outline
                  onClick={handleClearCart}
                  disabled={cartItems.length === 0}
                >
                  Clear Cart
                </CartActionButton>
              </ButtonRow>
            </CartFooter>
          </CartContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
`;

const CartContainer = styled(motion.div)`
  position: relative;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 20px 0;
`;

const EmptyCart = styled.p`
  text-align: center;
  color: #666;
  margin-top: 50px;
`;

const ShopNowBtn = styled.button`
  display: block;
  margin: 18px auto 0 auto;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s;
  &:hover {
    background: #c0392b;
  }
`;

const CartFooter = styled.div`
  border-top: 1px solid #eee;
  padding-top: 15px;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-weight: bold;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const CartActionButton = styled.button`
  flex: 1;
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  background: ${({ $outline }) => ($outline ? '#fff' : '#e74c3c')};
  color: ${({ $outline }) => ($outline ? '#e74c3c' : '#fff')};
  border: ${({ $outline }) => ($outline ? '2px solid #e74c3c' : 'none')};
  transition: background 0.18s, color 0.18s, border 0.18s;
  cursor: pointer;
  &:hover:enabled {
    background: ${({ $outline }) => ($outline ? '#fff7f5' : '#c0392b')};
    color: #e74c3c;
    border-color: #e74c3c;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Add custom styles for Swiper navigation buttons


const SwiperNavStyles = createGlobalStyle`
  .quick-buy-swiper .swiper-button-next,
  .quick-buy-swiper .swiper-button-prev {
    width: 30px !important;
    height: 30px !important;
    min-width: 30px !important;
    min-height: 30px !important;
    max-width: 30px !important;
    max-height: 30px !important;
    border-radius: 50%;
    background: #fff;
    color: #e74c3c;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    font-size: 16px !important;
    top: 40%;
  }
  .quick-buy-swiper .swiper-button-next:after,
  .quick-buy-swiper .swiper-button-prev:after {
    font-size: 16px !important;
  }
`;

const CartSidebarWithNavStyles = (props) => (
  <>
    <SwiperNavStyles />
    <CartSidebar {...props} />
  </>
);

export default CartSidebarWithNavStyles;