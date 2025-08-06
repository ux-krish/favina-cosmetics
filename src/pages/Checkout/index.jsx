import styled from 'styled-components';
import Radio from '../../components/ui/CustomRadio';
import { borderRadius, colors ,fontSizes, gapSizes, pxToRem } from '../../assets/styles/theme.js';
import CheckoutForm from './CheckoutForm';
import { useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../../redux/hooks';
import productData from '../../data/product.json';
import { useState, useEffect, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import bgHeader from '../../assets/images/detail-main-bg2.png';
import OrderSummary from './OrderSummary';
import PaymentSection from './PaymentSection';

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
        <PaymentSection />
      </FormSection>
      <OrderSummary
        orderItems={orderItems}
        handleRemoveOrderItem={handleRemoveOrderItem}
        setOrderItems={setOrderItems}
        discountRate={discountRate}
        discount={discount}
        platformCharge={platformCharge}
        total={total}
        coupon={coupon}
        setCoupon={setCoupon}
        couponApplied={couponApplied}
        setCouponApplied={setCouponApplied}
        couponError={couponError}
        setCouponError={setCouponError}
        couponCodes={couponCodes}
      />
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
  gap: 24px;
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

const CheckoutFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

export default CheckoutPage;
