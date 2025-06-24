import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAuth, useCart } from '../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import FormInput from '../../components/ui/FormInput';
import { clearCart } from '../../redux/slices/cartSlice';
import { createOrder } from '../../redux/slices/orderSlice';
import { updateProfile } from '../../redux/slices/authSlice';
import { useEffect, useRef } from 'react';

const CheckoutForm = () => {
  const { user, isAuthenticated } = useAuth();
  const { items } = useCart();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const orderIdRef = useRef(null);

  // Use user details as default values if authenticated
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: isAuthenticated && user ? user : {},
  });

  // Ensure form is reset with user data when user changes (e.g., after login)
  useEffect(() => {
    if (isAuthenticated && user) {
      reset(user);
    }
  }, [isAuthenticated, user, reset]);

  const onSubmit = (data) => {
    // Save checkout details to profile for future orders
    if (isAuthenticated) {
      dispatch(updateProfile(data));
    }
    const order = {
      customer: data,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      status: 'pending',
    };

    dispatch(createOrder(order))
      .unwrap()
      .then((createdOrder) => {
        dispatch(clearCart());
        orderIdRef.current = createdOrder.id;
        navigate(`/order-confirmation/${createdOrder.id}`);
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <FormInput
          label="First Name"
          {...register('firstName', { required: 'First name is required' })}
          error={errors.firstName}
        />
        <FormInput
          label="Last Name"
          {...register('lastName', { required: 'Last name is required' })}
          error={errors.lastName}
        />
      </FormGroup>
      
      <FormInput
        label="Email"
        type="email"
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        error={errors.email}
      />
      
      <FormInput
        label="Phone"
        {...register('phone', { 
          required: 'Phone is required',
          pattern: {
            value: /^[0-9]{10,15}$/,
            message: 'Invalid phone number'
          }
        })}
        error={errors.phone}
      />
      
      <FormInput
        label="Address"
        {...register('address', { required: 'Address is required' })}
        error={errors.address}
      />
      
      <FormGroup>
        <FormInput
          label="City"
          {...register('city', { required: 'City is required' })}
          error={errors.city}
        />
        <FormInput
          label="State"
          {...register('state', { required: 'State is required' })}
          error={errors.state}
        />
      </FormGroup>
      
      <FormGroup>
        <FormInput
          label="Country"
          {...register('country', { required: 'Country is required' })}
          error={errors.country}
        />
        <FormInput
          label="Postal Code"
          {...register('postalCode', { required: 'Postal code is required' })}
          error={errors.postalCode}
        />
      </FormGroup>
      
      <Button type="submit" fullWidth>
        Place Order
      </Button>
    </Form>
  );
};

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