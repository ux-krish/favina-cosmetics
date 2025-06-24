import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useCart } from '../../redux/hooks';
import { toggleCart, removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice';
import Button from '../common/Button';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';

const CartSidebar = () => {
  const dispatch = useAppDispatch();
  const { items, isCartOpen } = useCart();
  const navigate = useNavigate();
  const sidebarRef = useRef();

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

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
              <h3>Your Cart ({items.length})</h3>
              <CloseButton onClick={() => dispatch(toggleCart())}>×</CloseButton>
            </CartHeader>
            
            <CartItems>
              {items.length === 0 ? (
                <EmptyCart>Your cart is empty</EmptyCart>
              ) : (
                items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => dispatch(removeFromCart(item.id))}
                    onQuantityChange={(quantity) => 
                      dispatch(updateQuantity({ id: item.id, quantity }))
                    }
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
                  fullWidth 
                  onClick={() => {
                    dispatch(toggleCart());
                    navigate('/checkout');
                  }}
                  disabled={items.length === 0}
                >
                  Checkout
                </CartActionButton>
                <CartActionButton
                  fullWidth
                  variant="outline"
                  onClick={() => dispatch(clearCart())}
                  disabled={items.length === 0}
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
  z-index: 999;
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

const CartActionButton = styled(Button)`
  flex: 1;
  width : 100%;
`;

export default CartSidebar;