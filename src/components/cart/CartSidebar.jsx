import { createGlobalStyle, styled } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useCart } from '../../redux/hooks';
import { toggleCart, removeFromCart, updateQuantity, clearCart, addToCart } from '../../redux/slices/cartSlice';
import Button from '../common/Button';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import productData from '../../data/product.json';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css';

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

  // Pick 3 random upsell products
  const upsellProducts = productData.products
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Handler to update quantity or remove if 0
  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  // All products for quick buy slider (exclude those already in cart)
  const cartIds = items.map(i => i.id);
  const quickBuyProducts = productData.products.filter(p => !cartIds.includes(p.id));

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
            
            {/* --- Quick Buy Product Slider --- */}
            {quickBuyProducts.length > 0 && (
              <QuickBuySection>
                <QuickBuyTitle>Quick Buy</QuickBuyTitle>
                <Swiper
                  modules={[Navigation]}
                  navigation
                  spaceBetween={12}
                  slidesPerView={2}
                  style={{ width: '100%', marginBottom: 10 }}
                  breakpoints={{
                    480: { slidesPerView: 2 },
                    700: { slidesPerView: 2 },
                  }}
                  className="quick-buy-swiper"
                >
                  {quickBuyProducts.map(product => (
                    <SwiperSlide key={product.id}>
                      <QuickBuyCard>
                        <QuickBuyImg
                          src={
                            product.image.startsWith('/') || product.image.startsWith('http')
                              ? product.image
                              : `/${product.image}`
                          }
                          alt={product.title}
                        />
                        <QuickBuyName>{product.title}</QuickBuyName>
                        <QuickBuyPrice>
                          ${product.offerPrice && product.offerPrice < product.price
                            ? product.offerPrice.toFixed(2)
                            : product.price.toFixed(2)}
                        </QuickBuyPrice>
                        <QuickBuyBtn
                          onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
                        >
                          Add
                        </QuickBuyBtn>
                      </QuickBuyCard>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </QuickBuySection>
            )}

            <CartItems>
              {items.length === 0 ? (
                <>
                  <EmptyCart>Your cart is empty</EmptyCart>
                  <UpsellTitle>Recommended for you</UpsellTitle>
                  <UpsellGrid>
                    {productData.products
                      .sort(() => 0.5 - Math.random())
                      .slice(0, 3)
                      .map(product => (
                        <UpsellCard key={product.id}>
                          <UpsellImage
                            src={
                              product.image.startsWith('/') || product.image.startsWith('http')
                                ? product.image
                                : `/${product.image}`
                            }
                            alt={product.title}
                          />
                          <UpsellInfo>
                            <UpsellName>{product.title}</UpsellName>
                            <UpsellPrice>
                              ${product.offerPrice && product.offerPrice < product.price
                                ? product.offerPrice.toFixed(2)
                                : product.price.toFixed(2)}
                            </UpsellPrice>
                          </UpsellInfo>
                          <UpsellAddBtn
                            onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
                          >
                            Add to Cart
                          </UpsellAddBtn>
                        </UpsellCard>
                      ))}
                  </UpsellGrid>
                </>
              ) : (
                items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => dispatch(removeFromCart(item.id))}
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

const UpsellTitle = styled.div`
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: #e74c3c;
  margin: 24px 0 10px 0;
`;

const UpsellGrid = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
`;

const UpsellCard = styled.div`
  background: #fafafa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 12px 10px 10px 10px;
  width: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UpsellImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 6px;
  background: #fff;
  margin-bottom: 7px;
`;

const UpsellInfo = styled.div`
  text-align: center;
  margin-bottom: 7px;
`;

const UpsellName = styled.div`
  font-size: 13px;
  color: #333;
  font-weight: 500;
  margin-bottom: 2px;
`;

const UpsellPrice = styled.div`
  font-size: 14px;
  color: #e74c3c;
  font-weight: 600;
`;

const UpsellAddBtn = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 0;
  font-size: 13px;
  font-weight: 500;
  width: 100%;
  margin-top: 2px;
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

const CartActionButton = styled(Button)`
  flex: 1;
  width : 100%;
`;

const QuickBuySection = styled.div`
  margin-bottom: 18px;
`;

const QuickBuyTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #e74c3c;
  margin-bottom: 8px;
  text-align: left;
`;

const QuickBuyCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 10px 8px 8px 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QuickBuyImg = styled.img`
  width: 54px;
  height: 54px;
  object-fit: contain;
  border-radius: 6px;
  background: #fafafa;
  margin-bottom: 6px;
`;

const QuickBuyName = styled.div`
  font-size: 12px;
  color: #333;
  font-weight: 500;
  margin-bottom: 2px;
  text-align: center;
`;

const QuickBuyPrice = styled.div`
  font-size: 13px;
  color: #e74c3c;
  font-weight: 600;
  margin-bottom: 4px;
`;

const QuickBuyBtn = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 4px 0;
  font-size: 13px;
  font-weight: 500;
  width: 100%;
  cursor: pointer;
  transition: background 0.18s;
  &:hover {
    background: #c0392b;
  }
`;

// Add custom styles for Swiper navigation buttons


const SwiperNavStyles = createGlobalStyle`
  .quick-buy-swiper .swiper-button-next,
  .quick-buy-swiper .swiper-button-prev {
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    min-height: 20px !important;
    max-width: 20px !important;
    max-height: 20px !important;
    border-radius: 50%;
    background: #fff;
    color: #e74c3c;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    font-size: 13px !important;
    top: 40%;
  }
  .quick-buy-swiper .swiper-button-next:after,
  .quick-buy-swiper .swiper-button-prev:after {
    font-size: 13px !important;
  }
`;

const CartSidebarWithNavStyles = (props) => (
  <>
    <SwiperNavStyles />
    <CartSidebar {...props} />
  </>
);

export default CartSidebarWithNavStyles;