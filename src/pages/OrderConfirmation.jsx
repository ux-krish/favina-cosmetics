import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../components/common/Button';
import { getOrderById } from '../redux/slices/orderSlice'; // changed import

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setOrder(getOrderById(orderId));
  }, [orderId]);

  if (!order) {
    return (
      <Container>
        <h2>Order Not Found</h2>
        <Button as={Link} to="/products">Shop Now</Button>
      </Container>
    );
  }

  return (
    <OrderConfirmationWrapper>
      <Container>
      <h1>Order Confirmed!</h1>
      <OrderId>Order #{order.id}</OrderId>
      <Status>
        <strong>Status:</strong> {order.status === 'pending' ? 'Processing' : order.status}
      </Status>
      <OrderDetails>
        <h3>Products</h3>
        <ProductList>
          {order.items.map(item => (
            <ProductItem key={item.id}>
              <ProductImage src={item.image} alt={item.title} />
              <ProductInfo>
                <div>{item.title}</div>
                <div>Qty: {item.quantity}</div>
                <div>${(item.price * item.quantity).toFixed(2)}</div>
              </ProductInfo>
            </ProductItem>
          ))}
        </ProductList>
        <Total>
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </Total>
      </OrderDetails>
      <Button as={Link} to="/account/orders" style={{ marginTop: 30 }}>
        View My Orders
      </Button>
    </Container>
    </OrderConfirmationWrapper>
  );
};
const OrderConfirmationWrapper = styled.div`
  width: 100%;  
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 20px;
`;
const Container = styled.div`
  width: 100%;
  margin: 40px 0 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  padding: 30px 20px;
  text-align: center;
`;

const OrderId = styled.div`
  font-size: 18px;
  color: #888;
  margin-bottom: 10px;
`;

const Status = styled.div`
  font-size: 16px;
  color: #27ae60;
  margin-bottom: 20px;
`;

const OrderDetails = styled.div`
  margin: 30px 0 20px 0;
  text-align: left;
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ProductItem = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 6px;
  object-fit: cover;
  background: #f5f5f5;
`;

const ProductInfo = styled.div`
  flex: 1;
  font-size: 15px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 12px;
`;

export default OrderConfirmation;
