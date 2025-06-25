import styled from 'styled-components';
import CheckoutForm from './CheckoutForm';
import { useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../../redux/hooks';
import productData from '../../data/product.json';
import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Use user cart if logged in, fallback to redux cart for guest
  const getUserCart = () => {
    if (!user?.id) return [];
    const allCarts = JSON.parse(localStorage.getItem('carts') || '{}');
    const arr = Array.isArray(allCarts[user.id]) ? allCarts[user.id] : [];
    return arr;
  };
  const { items: reduxItems } = useCart();
  const items = isAuthenticated ? getUserCart() : reduxItems;

  // Use items as initial value for orderItems
  const [orderItems, setOrderItems] = useState(items);

  // Redirect to home if orderItems is empty
  useEffect(() => {
    if (orderItems.length === 0) {
      navigate('/');
    }
  }, [orderItems, navigate]);

  // Track which upsell products have been shown (by id)
  const [shownUpsellIds, setShownUpsellIds] = useState([]);

  // Pick 4 random upsell products not already in cart and not already shown
  const upsellProducts = (productData.products || [])
    .filter(
      p =>
        !orderItems.some(item => item.id === p.id) &&
        !shownUpsellIds.includes(p.id)
    )
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  // Add to order summary (cart) from upsell
  const handleAddUpsell = (product) => {
    let updated;
    const exists = orderItems.find(item => item.id === product.id);
    if (exists) {
      updated = orderItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [...orderItems, { ...product, quantity: 1 }];
    }
    setOrderItems(updated);

    // Mark this upsell as shown so a new one appears
    setShownUpsellIds(prev => [...prev, product.id]);

    // Also update user cart in localStorage if logged in
    if (isAuthenticated && user?.id) {
      const allCarts = JSON.parse(localStorage.getItem('carts') || '{}');
      allCarts[user.id] = updated;
      localStorage.setItem('carts', JSON.stringify(allCarts));
    }
  };

  // Remove product from order summary (does not affect cart)
  const handleRemoveOrderItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  // Calculate total from orderItems
  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CheckoutLayout>
      <FormSection>
        <BackButton type="button" onClick={() => navigate(-1)}>
          ← Back
        </BackButton>
        <h1>Checkout</h1>
        {/* --- Upsell Section --- */}
        <UpsellSection>
          <UpsellTitle>Recommended for You</UpsellTitle>
          <div style={{ position: 'relative' }}>
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onInit={swiper => {
                // Swiper v9+ requires this for custom navigation refs
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              spaceBetween={18}
              slidesPerView={2}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
              }}
              style={{ marginBottom: 10, paddingBottom: 8 }}
              className="checkout-upsell-swiper"
            >
              {upsellProducts.map(product => (
                <SwiperSlide key={product.id}>
                  <UpsellCard
                    onClick={() => navigate(`/products/${product.id}`)}
                    tabIndex={0}
                    title={product.title}
                  >
                    <UpsellImg
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
                      onClick={e => {
                        e.stopPropagation();
                        handleAddUpsell(product);
                      }}
                    >
                      Add to Order
                    </UpsellAddBtn>
                  </UpsellCard>
                </SwiperSlide>
              ))}
              {/* Custom navigation buttons */}
              <div
                ref={prevRef}
                className="swiper-button-prev"
                tabIndex={0}
                role="button"
                aria-label="Previous slide"
              ></div>
              <div
                ref={nextRef}
                className="swiper-button-next"
                tabIndex={0}
                role="button"
                aria-label="Next slide"
              ></div>
            </Swiper>
          </div>
        </UpsellSection>
        {/* --- End Upsell Section --- */}
        <CheckoutForm />
        <PaymentSection>
          <h2>Payment Method</h2>
          <PaymentOption>
            <input type="radio" id="cod" name="payment" checked readOnly />
            <label htmlFor="cod">Cash on Delivery</label>
          </PaymentOption>
          <Note>Only Cash on Delivery is available at this time.</Note>
        </PaymentSection>
      </FormSection>
      <OrderSummarySection>
        <OrderSummaryTitle>Order Summary</OrderSummaryTitle>
        <OrderItems>
          {orderItems.length === 0 ? (
            <EmptyMsg>Your cart is empty.</EmptyMsg>
          ) : (
            orderItems.map(item => (
              <OrderItem key={item.id}>
                <OrderItemImg src={item.image} alt={item.title} />
                <OrderItemInfo>
                  <OrderItemTitle>{item.title}</OrderItemTitle>
                  <OrderItemQty>Qty: {item.quantity}</OrderItemQty>
                  <OrderItemPrice>
                    ${(item.price * item.quantity).toFixed(2)}
                  </OrderItemPrice>
                </OrderItemInfo>
                <RemoveBtn
                  type="button"
                  title="Remove from order summary"
                  onClick={() => handleRemoveOrderItem(item.id)}
                >
                  ×
                </RemoveBtn>
              </OrderItem>
            ))
          )}
        </OrderItems>
        <OrderTotalRow>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </OrderTotalRow>
      </OrderSummarySection>
    </CheckoutLayout>
  );
};

const CheckoutLayout = styled.div`
  display: flex;
  gap: 40px;
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 30px;
    margin: 20px auto;
    padding: 0 8px;
  }
`;

const FormSection = styled.div`
  flex: 2;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  padding: 30px 20px;
  min-width: 0;
  /* Add a class for reference */
`;

const OrderSummarySection = styled.div`
  flex: 1;
  background: #faf9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  padding: 28px 20px 20px 20px;
  min-width: 260px;
  max-width: 370px;
  position: sticky;
  top: 140px;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  max-height: 650px; /* fallback for SSR */
  @media (min-width: 901px) {
    /* Match the form section height using JS if needed, but CSS fallback */
    
  }
  @media (max-width: 900px) {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
    position: static;
    top: unset;
    max-height: unset;
  }
`;

const OrderSummaryTitle = styled.h2`
  font-size: 22px;
  color: #e74c3c;
  margin-bottom: 18px;
  text-align: left;
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 18px;
  overflow-y: auto;
  /* Make it scrollable if too tall */
  max-height: calc(100vh - 180px);
`;

const OrderItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  background: #fff;
  border-radius: 7px;
  padding: 10px 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`;

const OrderItemImg = styled.img`
  width: 54px;
  height: 54px;
  object-fit: contain;
  border-radius: 6px;
  background: #fafafa;
`;

const OrderItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OrderItemTitle = styled.div`
  font-size: 15px;
  color: #222;
  font-weight: 500;
`;

const OrderItemQty = styled.div`
  font-size: 14px;
  color: #888;
`;

const OrderItemPrice = styled.div`
  font-size: 15px;
  color: #e74c3c;
  font-weight: 600;
`;

const OrderTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  border-top: 1px solid #eee;
  padding-top: 14px;
  margin-top: 10px;
`;

const PaymentSection = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input[type="radio"] {
    margin-right: 10px;
    accent-color: #e74c3c;
  }
`;

const Note = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 8px;
`;

const BackButton = styled.button`
  display: inline-block;
  margin-bottom: 18px;
  background: #fff;
  border: 1.5px solid #eee;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  padding: 7px 18px 7px 10px;
  border-radius: 22px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: color 0.18s, border 0.18s, background 0.18s;
  &:hover {
    color: #e74c3c;
    border-color: #e74c3c;
    background: #fff7f5;
  }
`;

const EmptyMsg = styled.div`
  color: #888;
  font-size: 15px;
  text-align: center;
  padding: 20px 0;
`;

const UpsellSection = styled.div`
  margin-bottom: 32px;
  background: #faf9fa;
  border-radius: 8px;
  padding: 18px 14px 10px 14px;
  box-shadow: 0 2px 8px rgba(231,76,60,0.06);
`;

const UpsellTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
  margin-bottom: 12px;
`;

const UpsellCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 12px 10px 10px 10px;
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.18s, transform 0.18s;
  cursor: pointer;
  &:hover, &:focus {
    box-shadow: 0 4px 16px rgba(231,76,60,0.13);
    transform: translateY(-2px) scale(1.03);
    outline: none;
  }
`;

const UpsellImg = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 6px;
  background: #fafafa;
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

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 8px;
  padding: 0 6px;
  line-height: 1;
  &:hover {
    color: #c0392b;
    background: #fff0f0;
    border-radius: 50%;
  }
`;

export default CheckoutPage;
