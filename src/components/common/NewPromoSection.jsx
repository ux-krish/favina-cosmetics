import React from "react";
import styled from "styled-components";
import Button from './Button';

import { useNavigate } from 'react-router-dom';
import { colors, fontSizes, gapSizes } from '../../assets/styles/theme';

const PromoWrapperNew = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.background};
  background-image: url("/lady-promo.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: left center;
  padding: ${gapSizes.xl} ${gapSizes.md};
  margin: 70px auto 0;
  overflow: hidden;
  min-height: 39vw;
  padding: 30px 0;
  @media (max-width: 768px) {
    flex-direction: column;
    background-position:top left;
    padding: ${gapSizes.lg} ${gapSizes.sm};
    display: grid;
    grid-template-columns: 1fr;
    background-size: 189vw;
  }
`;

const PromoButton = styled(Button)`
  margin-top: 18px;
  max-width: 200px;
  font-size: ${fontSizes.md};
  font-weight: 700;
  color: ${colors.textLight};
  padding: 12px 30px;
  @media (max-width:700px){
    margin-top:0;
  }
`;

const Content = styled.div`
  padding: ${gapSizes.xl};
  border-radius: 12px;
  max-width: 600px;
  
  flex:1;
  text-align: center;
  z-index: 2;
  @media (max-width: 768px) {
    &:first-child {
      min-height:100vw;
  }
  }
  h4 {
    font-size: ${fontSizes.xxl};
    font-weight: 700;
    color: ${colors.primary};
    margin-bottom: ${gapSizes.sm};
    font-style: italic;
  }

  p {
    color: ${colors.textDark};
    font-size: ${fontSizes.md};
    margin-bottom: ${gapSizes.xs};
  }

  .big-text {
    font-size: ${fontSizes.xxl};
    font-weight: 800;
    color: ${colors.textDark};
    margin-top: ${gapSizes.md};
  }

  .highlight {
    color: ${colors.highlight};
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
        <PromoButton onClick={() => navigate('/products')}>Shop Now</PromoButton>
      </Content>
    </PromoWrapperNew>
  );
};

export default NewPromoSection;
