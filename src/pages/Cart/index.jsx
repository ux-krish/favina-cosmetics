import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice';
import CartItem from '../../components/cart/CartItem';
import Button from '../../components/common/Button';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <EmptyCartContainer>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet</p>
        <Button as={Link} to="/products">
          Continue Shopping
        </Button>
      </EmptyCartContainer>
    );
  }

  return (
    <CartContainer>
      <CartHeader>
        <h2>Your Cart ({items.length})</h2>
        <ClearButton onClick={() => dispatch(clearCart())} data-tooltip="Clear all items from cart">
          Clear Cart
        </ClearButton>
      </CartHeader>
      
      <CartItems>
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={() => dispatch(removeFromCart(item.id))}
            onQuantityChange={(quantity) => 
              dispatch(updateQuantity({ id: item.id, quantity }))
            }
          />
        ))}
      </CartItems>
      
      <CartSummary>
        <SummaryRow>
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Shipping</span>
          <span>Free</span>
        </SummaryRow>
        <SummaryRow total>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </SummaryRow>
        
        <Button as={Link} to="/checkout" fullWidth tooltip="Proceed to Checkout">
          Proceed to Checkout
        </Button>
        
        <ContinueShopping as={Link} to="/products" data-tooltip="Continue shopping">
          Continue Shopping
        </ContinueShopping>
      </CartSummary>
    </CartContainer>
  );
};

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const CartHeader = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    color: #333;
    text-decoration: underline;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-column: 1;
  }
`;

const CartSummary = styled.div`
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  @media (min-width: 768px) {
    grid-column: 2;
    position: sticky;
    top: 20px;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-weight: ${props => props.total ? 'bold' : 'normal'};
  font-size: ${props => props.total ? '18px' : '16px'};
  border-top: ${props => props.total ? '1px solid #ddd' : 'none'};
  margin-top: ${props => props.total ? '10px' : '0'};
  padding-top: ${props => props.total ? '10px' : '0'};
`;

const ContinueShopping = styled(Link)`
  text-align: center;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyCartContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  max-width: 500px;
  margin: 0 auto;
  
  h2 {
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
`;

export default CartPage;