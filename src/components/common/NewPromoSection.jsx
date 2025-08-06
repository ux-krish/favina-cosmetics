import React from "react";
import styled from "styled-components";
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const PromoWrapperNew = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef9f7;
  background-image: url("/lady-promo.png"); /* replace with your image */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: left center;
  padding: 60px 30px;
  border-radius: 10px;
  margin: 50px auto 0;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    background-position: top center;
    padding: 40px 20px;
  }
`;

const Content = styled.div`
  padding: 40px;
  border-radius: 12px;
  max-width: 600px;
  flex:1;
  text-align: center;
  z-index: 2;

  h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #b19cd9;
    margin-bottom: 15px;
    font-style: italic;
  }

  p {
    color: #4c3a36;
    font-size: 1rem;
    margin-bottom: 12px;
  }

  .big-text {
    font-size: 1.8rem;
    font-weight: 800;
    color: #4c3a36;
    margin-top: 20px;
  }

  .highlight {
    color: #f5968c;
  }

  .bold {
    font-weight: 700;
  }
`;

const NewPromoSection = () => {
  const navigate = useNavigate();
  return (
    <PromoWrapperNew>
        <Content></Content>
      <Content>
        <h4>Discount</h4>
        <p>Nourish your skin with toxin-free cosmetic products. With the offers that you can’t refuse.</p>
        <p className="big-text">
          Get Your <span className="highlight">50% Off</span>
        </p>
        <p>on your first purchase<br />for the next <span className="bold">24 hours only!</span></p>
        <Button onClick={() => navigate('/products')}>Get Now</Button>
      </Content>
    </PromoWrapperNew>
  );
};

export default NewPromoSection;
