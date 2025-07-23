import styled from 'styled-components';
import LogoSvg from '../../assets/images/logo.svg';
import { Link } from 'react-router-dom';
import { colors, fontSizes } from '../../assets/styles/theme';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Section>
          <LogoImg src={LogoSvg} alt="Favina Cosmetics" />
          <Text>Your one-stop shop for all your needs</Text>
        </Section>
        <Section>
          <Title>Quick Links</Title>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/products">Products</FooterLink>
          <FooterLink to="/account">My Account</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </Section>
        <Section>
          <Title>Contact</Title>
          <Text>Email: contact@favinacosmetics.com</Text>
          <Text>Phone: +1 234 567 890</Text>
        </Section>
      </FooterContent>
      <Copyright>© {new Date().getFullYear()} Favina Cosmetics. All rights reserved.</Copyright>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: ${colors.dark};
  color: ${colors.textLight};
  padding: 40px 20px 20px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${fontSizes.md};
`;

const Text = styled.p`
  margin: 0;
  color: ${colors.gray};
  font-size: ${fontSizes.sm};
`;

const FooterLink = styled(Link)`
  color: ${colors.gray};
  text-decoration: none;
  font-size: ${fontSizes.sm};

  &:hover {
    color: ${colors.textLight};
  }
`;

const Copyright = styled.p`
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #444;
  color: #aaa;
  font-size: ${fontSizes.sm};
`;

const LogoImg = styled.img`
  height: 38px;
  width: 106px;
  display: block;
  margin-bottom: 10px;
`;

export default Footer;