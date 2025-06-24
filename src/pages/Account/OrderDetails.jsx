import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Simulate fetching orders from localStorage
    const userOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const userSpecificOrders = userOrders.filter(order => 
      order.customer.email === user.email
    );
    setOrders(userSpecificOrders);
  }, [user.email]);

  return (
    <OrdersContainer>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <EmptyMessage>You haven't placed any orders yet.</EmptyMessage>
      ) : (
        <OrdersList>
          {orders.map((order) => (
            <OrderItem key={order.date}>
              <OrderHeader>
                <div>
                  <strong>Order #</strong> {order.date}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Total:</strong> ${order.total.toFixed(2)}
                </div>
                <div>
                  <Status status={order.status}>{order.status}</Status>
                </div>
              </OrderHeader>
              
              <OrderProducts>
                {order.items.map((item) => (
                  <ProductItem key={item.id}>
                    <ProductImage src={item.image} alt={item.title} />
                    <ProductDetails>
                      <ProductName>{item.title}</ProductName>
                      <ProductPrice>${item.price.toFixed(2)}</ProductPrice>
                      <ProductQuantity>Qty: {item.quantity}</ProductQuantity>
                    </ProductDetails>
                  </ProductItem>
                ))}
              </OrderProducts>
            </OrderItem>
          ))}
        </OrdersList>
      )}
    </OrdersContainer>
  );
};

const OrdersContainer = styled.div`
  h2 {
    margin-bottom: 20px;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  margin-top: 40px;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const OrderItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Status = styled.span`
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  background: ${({ status }) => 
    status === 'completed' ? '#d4edda' : 
    status === 'cancelled' ? '#f8d7da' : '#fff3cd'};
  color: ${({ status }) => 
    status === 'completed' ? '#155724' : 
    status === 'cancelled' ? '#721c24' : '#856404'};
`;

const OrderProducts = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ProductItem = styled.div`
  display: flex;
  gap: 15px;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-weight: 500;
`;

const ProductPrice = styled.div`
  color: #666;
  font-size: 14px;
  margin: 5px 0;
`;

const ProductQuantity = styled.div`
  color: #666;
  font-size: 14px;
`;

export { OrderDetails };
export default OrderDetails;