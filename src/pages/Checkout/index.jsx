import styled from 'styled-components';
import CheckoutForm from './CheckoutForm';

const CheckoutPage = () => {
  return (
    <Container>
      <h1>Checkout</h1>
      <CheckoutForm />
      <PaymentSection>
        <h2>Payment Method</h2>
        <PaymentOption>
          <input type="radio" id="cod" name="payment" checked readOnly />
          <label htmlFor="cod">Cash on Delivery</label>
        </PaymentOption>
        <Note>Only Cash on Delivery is available at this time.</Note>
      </PaymentSection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 700px;
  margin: 40px auto;
  padding: 30px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
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

export default CheckoutPage;
