import styled from 'styled-components';
import { colors ,fontSizes, pxToRem } from '../../assets/styles/theme';
import CheckoutForm from './CheckoutForm';
import { useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../../redux/hooks';
import productData from '../../data/product.json';
import { useState, useEffect, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import bgHeader from '../../assets/images/detail-main-bg2.png';

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

  // Coupon logic
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Coupon codes and their discounts
  const couponCodes = {
    "SAVE10": 0.10,
    "SAVE20": 0.20,
    "SAVE30": 0.30,
  };

  // Calculate subtotal, discount, platform charge, and total
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountRate = couponApplied && couponCodes[coupon.toUpperCase()] ? couponCodes[coupon.toUpperCase()] : 0.10;
  const discount = subtotal > 0 ? Math.round(subtotal * discountRate * 100) / 100 : 0;
  const platformCharge = subtotal > 0 ? 5.00 : 0;
  const total = subtotal - discount + platformCharge;

  return (
    <>
      <CheckoutHeader>
       <h1>Checkout</h1>
    </CheckoutHeader>
    <CheckoutLayout>
      <FormSection>
        <CheckoutForm discountedTotal={total} orderItems={orderItems} />
        <PaymentSection>
          <h2>Payment Method</h2>
          <PaymentOption>
            <RadioWrapper>
              <CustomRadio>
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked
                  readOnly
                />
                <span className="custom" />
              </CustomRadio>
              <label htmlFor="cod">Cash on Delivery</label>
            </RadioWrapper>
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
                    <OrderItemQty>
                      Qty:
                      <QtyControl>
                        <QtyBtn
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => {
                            if (item.quantity > 1) {
                              setOrderItems(orderItems.map(i =>
                                i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                              ));
                            }
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 12H19" stroke="#4E4E4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
                        </QtyBtn>
                        <QtyInput
                          type="tel"
                          min={1}
                          value={item.quantity}
                          onChange={e => {
                            const val = Math.max(1, parseInt(e.target.value) || 1);
                            setOrderItems(orderItems.map(i =>
                              i.id === item.id ? { ...i, quantity: val } : i
                            ));
                          }}
                        />
                        <QtyBtn
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => {
                            setOrderItems(orderItems.map(i =>
                              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                            ));
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5V19M5 12H19" stroke="#4E4E4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
                        </QtyBtn>
                      </QtyControl>
                    </OrderItemQty>
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
        <CouponForm onSubmit={e => {
          e.preventDefault();
          const code = coupon.trim().toUpperCase();
          if (couponCodes[code]) {
            setCouponApplied(true);
            setCouponError("");
          } else {
            setCouponApplied(false);
            setCouponError("Invalid coupon code. Try SAVE10, SAVE20, or SAVE30.");
          }
        }}>
          <CouponLabel htmlFor="coupon-input">Coupon Code</CouponLabel>
          <CouponFormWrapper>
            
            <CouponInput
              id="coupon-input"
              type="text"
              value={coupon}
              onChange={e => {
                setCoupon(e.target.value);
                setCouponApplied(false);
                setCouponError("");
              }}
              placeholder="Enter coupon code"
              autoComplete="off"
            />
            <CouponButton type="submit">Apply</CouponButton>
          </CouponFormWrapper>
          
          {couponApplied && couponCodes[coupon.toUpperCase()] && (
            <CouponSuccess>Coupon applied: {coupon.toUpperCase()} ({couponCodes[coupon.toUpperCase()] * 100}% off)</CouponSuccess>
          )}
          {couponError && <CouponError>{couponError}</CouponError>}
        </CouponForm>
        <OrderSummaryRow>
          <span>Discount ({discountRate * 100}%)</span>
          <span>- ${discount.toFixed(2)}</span>
        </OrderSummaryRow>
        <OrderSummaryRow>
          <span>Platform Charge</span>
          <span>+ ${platformCharge.toFixed(2)}</span>
        </OrderSummaryRow>
        <OrderTotalRow>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </OrderTotalRow>
      </OrderSummarySection>
    </CheckoutLayout>
    </>
  );
};
const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CustomRadio = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  input[type="radio"] {
    opacity: 0;
    position: absolute;
    width: 20px;
    height: 20px;
    left: 0;
    top: 0;
    margin: 0;
    z-index: 2;
    cursor: pointer;
  }
  .custom {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${colors.textLight};
    border: 2px solid ${colors.primary};
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: border 0.18s, box-shadow 0.18s;
  }
  input[type="radio"]:checked + .custom {
    background: ${colors.primary};
    border-color: ${colors.primary};
  }
  input[type="radio"]:checked + .custom:after {
    content: '';
    display: block;
    position: static;
    top: 4px;
    left: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${colors.textLight};
  }
`;
const CheckoutHeader = styled.div` 
  
  max-width: 1320px;
  margin: ${pxToRem(30)} auto;
  padding: 0 ${pxToRem(20)};
  h1{
    background: ${colors.primary} url(${bgHeader}) no-repeat center center;
    background-size: cover;
    width: 100%;
    border-radius: ${pxToRem(12)};
    text-align: center;
    color: ${colors.text};
    min-height: ${pxToRem(120)};
    display: flex;
    align-items: center;
    justify-content: center;  
  }
`;

const CheckoutLayout = styled.div`
  display: flex;
  gap: 40px;
  max-width: 1320px;
  width: 100%;
  margin: 40px auto;
  padding: 0 20px;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column-reverse;
    gap: 24px;
    margin: 18px auto;
    padding: 0 20px;
  }
  @media (max-width: 600px) {
    gap: 10px;
    padding: 0 20px;
    margin: 20px auto;
  }
`;

const FormSection = styled.div`
  flex: 0 0 60%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  padding: 30px 20px;
  min-width: 0;
  @media (max-width: 900px) {
    padding: 20px 10px;
    flex:none;
    width: 100%;
  }
  @media (max-width: 600px) {
    padding:12px 12px;
  }
`;

const OrderSummarySection = styled.div`
  flex: 1;
  background: #fff  ;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  padding: 28px 20px 20px 20px;
  min-width: 260px;
  position: sticky;
  top: 140px;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  max-height: 650px;
  @media (max-width: 900px) {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
    position: static;
    top: unset;
    max-height: unset;
    padding: 18px 10px 10px 10px;
  }
  @media (max-width: 600px) {
    padding: 12px 12px 8px 12px;
    min-width: 0;
  }
`;

const OrderSummaryTitle = styled.h2`
  font-size: 20px;
  color: ${colors.primary};
  margin-bottom: 18px;
  text-align: left;
  @media (max-width: 600px) {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 18px;
  overflow-y: auto;
  max-height: calc(100vh - 180px);
  @media (max-width: 600px) {
    gap: 10px;
    margin-bottom: 10px;
    max-height: 220px;
  }
`;

const OrderItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  background: #fff;
  border-radius: 7px;
  padding: 10px 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  @media (max-width: 600px) {
    gap: 6px;
    padding: 7px 4px;
  }
`;

const OrderItemImg = styled.img`
  width: 54px;
  height: 54px;
  object-fit: contain;
  border-radius: 6px;
  background: #fafafa;
  @media (max-width: 600px) {
    width: 38px;
    height: 38px;
  }
`;

const OrderItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  @media (max-width: 600px) {
    gap: 1px;
  }
`;

const OrderItemTitle = styled.div`
  font-size: 15px;
  color: #222;
  font-weight: 500;
  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const OrderItemQty = styled.div`
  font-size: 14px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 8px;
  @media (max-width: 600px) {
    font-size: 12px;
    gap: 4px;
  }
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const QtyBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f3f0f8;
  border: 1px solid #ede7f6;
  color: #888;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: #ede7f6;
    color: ${colors.primary};
  }
`;

const QtyInput = styled.input`
  width: 38px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #ede7f6;
  background: #fff;
  text-align: center;
  font-size: 15px;
  color: #222;
  font-weight: 600;
  outline: none;
`;

const OrderItemPrice = styled.div`
  font-size: 15px;
  color: ${colors.danger};
  font-weight: 600;
  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const CouponForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  margin: 18px 0 10px 0;
  padding: 16px 18px 12px 18px;
  background: #fff7f7;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(229,166,166,0.07);
  border: 1px solid #f3e2e2;
`;
const CouponFormWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  `;
const CouponLabel = styled.label`
  font-size: 15px;
  color: ${colors.primary};
  font-weight: 700;
  margin-bottom: 8px;
`;

const CouponInput = styled.input`
  font-size: 15px;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1.5px solid ${colors.primary};
  background: #fff;
  color: #222;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  flex:1;
`;

const CouponButton = styled.button`
  width: 100px;
  font-size: 15px;
  padding: 10px 24px;
  border-radius: 6px;
  background: ${colors.primary};
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(229,166,166,0.07);
  transition: background 0.18s;
  &:hover {
    background: ${colors.accent};
  }
`;

const CouponSuccess = styled.div`
  color: #27ae60;
  font-size: 14px;
  margin-top: 8px;
  font-weight: 600;
`;

const CouponError = styled.div`
  color: ${colors.accent};
  font-size: 14px;
  margin-top: 8px;
  font-weight: 600;
`;

const OrderSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 500;
  color: #888;
  margin-bottom: 4px;
`;

const OrderTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  border-top: 1px solid #eee;
  padding-top: 14px;
  margin-top: 10px;
  @media (max-width: 600px) {
    font-size: 15px;
    padding-top: 8px;
    margin-top: 6px;
  }
`;

const PaymentSection = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  @media (max-width: 600px) {
    margin-top: 18px;
    padding-top: 10px;
  }
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input[type="radio"] {
    margin-right: 10px;
    accent-color: ${colors.danger};
  }
`;

const Note = styled.div`
  color: ${colors.danger};
  font-size: 14px;
  margin-top: 8px;
  @media (max-width: 600px) {
    font-size: 12px;
    margin-top: 4px;
  }
`;


const EmptyMsg = styled.div`
  color: #888;
  font-size: 15px;
  text-align: center;
  padding: 20px 0;
  @media (max-width: 600px) {
    font-size: 12px;
    padding: 10px 0;
  }
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
  color: ${colors.danger};
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
  color: ${colors.danger};
  font-weight: 600;
`;

const UpsellAddBtn = styled.button`
  background: ${colors.danger};
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
    background: ${colors.dangerDark};
  }
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: ${colors.danger};
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 8px;
  padding: 0 6px;
  line-height: 1;
  &:hover {
    color: ${colors.dangerDark};
    background: #fff0f0;
    border-radius: 50%;
  }
`;

export default CheckoutPage;
