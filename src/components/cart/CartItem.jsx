import styled from 'styled-components';
import { useState } from 'react';

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity) => {
    const qty = Math.max(1, Math.min(99, newQuantity));
    setQuantity(qty);
    onQuantityChange(qty);
  };

  return (
    <ItemContainer>
      <Image src={item.image} alt={item.title} />
      <Details>
        <Title>{item.title}</Title>
        <Price>${item.price.toFixed(2)}</Price>
        <QuantityControls>
          <Button onClick={() => handleQuantityChange(quantity - 1)}>-</Button>
          <Input 
            type="number" 
            value={quantity} 
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            min="1"
            max="99"
          />
          <Button onClick={() => handleQuantityChange(quantity + 1)}>+</Button>
        </QuantityControls>
      </Details>
      <RemoveButton onClick={() => onRemove(item.id)}>×</RemoveButton>
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  position: relative;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 14px;
`;

const Price = styled.span`
  font-weight: bold;
  font-size: 16px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

const Button = styled.button`
  width: 25px;
  height: 25px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
`;

const Input = styled.input`
  width: 40px;
  height: 25px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 15px;
  right: 0;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
`;

export default CartItem;