import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAuth, useCart } from '../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import FormInput from '../../components/ui/FormInput';
import CustomCheckbox from '../../components/ui/CustomCheckbox';
import { clearCart } from '../../redux/slices/cartSlice';
import { updateProfile } from '../../redux/slices/authSlice';
import { getOrdersFromStorage } from '../../redux/slices/orderSlice'; // import helper
import { useEffect, useRef, useState } from 'react';
import { colors, fontSizes, pxToRem } from '../../assets/styles/theme.js';

// Accept discountedTotal and orderItems as props
const CheckoutForm = ({ discountedTotal, orderItems }) => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const orderIdRef = useRef(null);
  const [billingSame, setBillingSame] = useState(true);

  // Shipping form
  const { register: registerShipping, handleSubmit: handleShippingSubmit, formState: { errors: shippingErrors }, reset: resetShipping, getValues: getShippingValues } = useForm({
    defaultValues: isAuthenticated && user ? user : {},
  });

  // Billing form
  const { register: registerBilling, formState: { errors: billingErrors }, reset: resetBilling, getValues: getBillingValues } = useForm();

  // Sync billing fields with shipping if checkbox is checked
  useEffect(() => {
    if (billingSame) {
      resetBilling(getShippingValues());
    }
    // eslint-disable-next-line
  }, [billingSame]);

  // Ensure shipping form is reset with user data when user changes (e.g., after login)
  useEffect(() => {
    if (isAuthenticated && user) {
      resetShipping(user);
      if (billingSame) resetBilling(user);
    }
  }, [isAuthenticated, user, resetShipping, resetBilling, billingSame]);

  const onSubmit = (shippingData) => {
    let billingData = {};
    if (billingSame) {
      billingData = { ...shippingData };
    } else {
      billingData = getBillingValues();
    }
    if (isAuthenticated) {
      dispatch(updateProfile(shippingData));
    }
    const order = {
      shipping: shippingData,
      billing: billingData,
      items: orderItems,
      total: discountedTotal,
      date: new Date().toISOString(),
      status: 'pending',
    };

    // Add order to localStorage directly
    const orders = getOrdersFromStorage();
    const newOrder = { ...order, id: Date.now().toString() };
    const updatedOrders = [...orders, newOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Store shipping and billing details separately for confirmation page
    localStorage.setItem('shippingDetails', JSON.stringify(shippingData));
    localStorage.setItem('billingDetails', JSON.stringify(billingData));

    // Clear cart for logged in user in localStorage
    if (isAuthenticated && user?.id) {
      const allCarts = JSON.parse(localStorage.getItem('carts') || '{}');
      allCarts[user.id] = [];
      localStorage.setItem('carts', JSON.stringify(allCarts));
    }

    dispatch(clearCart());
    orderIdRef.current = newOrder.id;
    navigate(`/order-confirmation/${newOrder.id}`);
  };

  return (
    <Form onSubmit={handleShippingSubmit(onSubmit)}>
      <SectionTitle>Shipping Address</SectionTitle>
      <FormGroup>
        <FormInput
          label="First Name"
          {...registerShipping('firstName', { required: 'First name is required' })}
          error={shippingErrors.firstName}
          readOnly={isAuthenticated}
          disabled={isAuthenticated}
        />
        <FormInput
          label="Last Name"
          {...registerShipping('lastName', { required: 'Last name is required' })}
          error={shippingErrors.lastName}
          readOnly={isAuthenticated}
          disabled={isAuthenticated}
        />
      </FormGroup>
      <FormInput
        label="Email"
        type="email"
        {...registerShipping('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        error={shippingErrors.email}
        readOnly={isAuthenticated}
        disabled={isAuthenticated}
      />
      <FormInput
        label="Phone"
        {...registerShipping('phone', { 
          required: 'Phone is required',
          pattern: {
            value: /^[0-9]{10,15}$/,
            message: 'Invalid phone number'
          }
        })}
        error={shippingErrors.phone}
      />
      <FormInput
        label="Address"
        {...registerShipping('address', { required: 'Address is required' })}
        error={shippingErrors.address}
      />
      <FormGroup>
        <FormInput
          label="City"
          {...registerShipping('city', { required: 'City is required' })}
          error={shippingErrors.city}
        />
        <FormInput
          label="State"
          {...registerShipping('state', { required: 'State is required' })}
          error={shippingErrors.state}
        />
      </FormGroup>
      <FormGroup>
        <FormInput
          label="Country"
          {...registerShipping('country', { required: 'Country is required' })}
          error={shippingErrors.country}
        />
        <FormInput
          label="Postal Code"
          {...registerShipping('postalCode', { required: 'Postal code is required' })}
          error={shippingErrors.postalCode}
        />
      </FormGroup>
      <BillingSection >
        <CustomCheckbox
          checked={billingSame}
          onChange={e => setBillingSame(e.target.checked)}
          style={{ marginTop: 4 }}
        >
          Billing address same as shipping address
        </CustomCheckbox>
        {!billingSame && (
          <>
            <SectionTitle style={{ marginTop: 24 }}>Billing Address</SectionTitle>
            <BillingForm>
              <FormGroup>
                <FormInput
                  label="Billing First Name"
                  {...registerBilling('firstName', { required: 'First name is required' })}
                  error={billingErrors.firstName}
                />
                <FormInput
                  label="Billing Last Name"
                  {...registerBilling('lastName', { required: 'Last name is required' })}
                  error={billingErrors.lastName}
                />
              </FormGroup>
              <FormInput
                label="Billing Email"
                type="email"
                {...registerBilling('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={billingErrors.email}
              />
              <FormInput
                label="Billing Phone"
                {...registerBilling('phone', { 
                  required: 'Phone is required',
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: 'Invalid phone number'
                  }
                })}
                error={billingErrors.phone}
              />
              <FormInput
                label="Billing Address"
                {...registerBilling('address', { required: 'Address is required' })}
                error={billingErrors.address}
              />
              <FormGroup>
                <FormInput
                  label="Billing City"
                  {...registerBilling('city', { required: 'City is required' })}
                  error={billingErrors.city}
                />
                <FormInput
                  label="Billing State"
                  {...registerBilling('state', { required: 'State is required' })}
                  error={billingErrors.state}
                />
              </FormGroup>
              <FormGroup>
                <FormInput
                  label="Billing Country"
                  {...registerBilling('country', { required: 'Country is required' })}
                  error={billingErrors.country}
                />
                <FormInput
                  label="Billing Postal Code"
                  {...registerBilling('postalCode', { required: 'Postal code is required' })}
                  error={billingErrors.postalCode}
                />
              </FormGroup>
            </BillingForm>
          </>
        )}
      </BillingSection>
      <ButtonRow>
        <BackButtonStyled type="button" onClick={() => navigate('/products')}>
          ← Back
        </BackButtonStyled>
        <PlaceOrderButtonStyled type="submit" >
          Complete Checkout
        </PlaceOrderButtonStyled>
      </ButtonRow>

    </Form>
  );
  };

const SectionTitle = styled.h3`
  font-size: 20px;
  color: ${colors.primary};
`;

const BillingSection = styled.div`
  margin: 24px 0 0 0;
  padding: 18px 0 0 0;
  border-top: 1px solid #eee;
`;

const BillingForm = styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-top: 18px;
`;

const BackButtonStyled = styled(Button)`
  background: #fff;
  border: 1.5px solid #eee;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  width: 170px;
  //padding: 7px 18px 7px 10px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: color 0.18s, border 0.18s, background 0.18s;
  &:hover {
    color: ${colors.primary};
    border-color: ${colors.primary};
    background: #fff7f5;
  }
  @media (max-width: 600px) {
    font-size: 13px;
    padding: 5px 10px 5px 7px;
    margin-bottom: 10px;
  }
`;

const PlaceOrderButtonStyled = styled(Button)`
  background: ${colors.primary};
  color: ${colors.textLight};
  border: ${pxToRem(1)} solid #eee;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  font-size: 16px;
  border-radius: 6px;
  //padding: 7px 18px;
  font-weight: 600;
  &:hover {
    background: ${colors.accent};
    color: #fff;
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

export default CheckoutForm;