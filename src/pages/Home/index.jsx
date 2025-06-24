import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ProductGrid from '../../components/product/ProductGrid';
import Button from '../../components/common/Button';
import Testimonials from '../../components/common/Testimonials';
import productData from '../../data/product.json';
import promoImg from '../../assets/images/main-bg1.png';
import bannerImg from '../../assets/images/Banner.jpg';
import { useImageBasePath } from '../../context/ImagePathContext';

const sliderMessages = [
  { text: "Limited Time Only", highlight: true },
  { text: "Flat 30% Off", highlight: false },
  { text: "Free Gift Inside", highlight: true },
  { text: "Hot Deal Alert", highlight: false },
  { text: "Exclusive Online Offer", highlight: true },
  { text: "Glow & Save", highlight: false }
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageBasePath = useImageBasePath();

  useEffect(() => {
    // Fetch products and testimonials from src/product.json
    setProducts(productData.products || []);
    // Gather all testimonials from all products
    const allTestimonials = [];
    (productData.products || []).forEach(product => {
      if (product.testimonials && product.testimonials.length > 0) {
        product.testimonials.forEach(t =>
          allTestimonials.push({
            ...t,
            productId: product.id,
            productTitle: product.title,
            category: product.category,
          })
        );
      }
    });
    setTestimonials(allTestimonials);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HeroSection $banner={`${bannerImg}`}>
         <Container>
        <HeroInner>
          <HeroHeading>
            Unleash Your <Highlight>Natural Glow</Highlight>
          </HeroHeading>
          <HeroSubtitle>
            Discover skincare and makeup that loves you back.
          </HeroSubtitle>
          <HeroOfferRow>
            <DiscountBadge>Get 25% OFF</DiscountBadge>
            <OfferText>on your first purchase!</OfferText>
          </HeroOfferRow>
          <ShopNowBtn to="/products">Shop Now</ShopNowBtn>
        </HeroInner>
        </Container>
      </HeroSection>

      <TextSliderWrapper>
        <Container>
        <TextSlider>
          <TextSliderTrack>
            {[...sliderMessages, ...sliderMessages].map((msg, idx) => (
              <TextSliderItem key={idx} $highlight={msg.highlight}>
                {msg.text}
              </TextSliderItem>
            ))}
          </TextSliderTrack>
        </TextSlider>
        </Container>
      </TextSliderWrapper>

      <Container>
        <PromoBanner>
        <PromoImage src={promoImg} alt="Limited Edition Unlimited Glam" />
        <PromoContent>
          <PromoTitle>
            <PromoTitlePink>Limited Edition</PromoTitlePink>
            <PromoTitlePurple>Unlimited Glam</PromoTitlePurple>
          </PromoTitle>
          <PromoDesc>
            Unveil your beauty with our exclusive launch offer on premium nail polish shades.
          </PromoDesc>
          <PromoOffer>
            <PromoOfferLabel>Flat</PromoOfferLabel>
            <PromoOfferHighlight>30% OFF</PromoOfferHighlight>
          </PromoOffer>
          <PromoSub>
            on your first purchase<br />
            for the next <PromoHighlight>24 hours</PromoHighlight> only!
          </PromoSub>
          <PromoButton to="/products">Shop Now</PromoButton>
        </PromoContent>
        </PromoBanner>
      </Container>
    
      <FeaturedSection>
        <Container>
        <h2>Featured Products</h2>
        <ProductGrid products={products.slice(0, 8)} />
        </Container>
      </FeaturedSection>
      <Testimonials testimonials={testimonials} />
    </>
  );
};

const Container = styled.div`
  max-width: 1320px;
  width: 100%;
  margin: 0 auto;
  padding: 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  & > * {
    flex: 1;
    width: 100%;
   }
`;

const HeroSection = styled.section`
  overflow: hidden;
  width: 100%;
  min-height: 40vh;
  padding: 100px 30px 100px;
  background: url(${props => props.$banner}) center center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 900px) {
    padding-top:50px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 200px;
    min-height: 420px;
    justify-content: center;
    background-position: center;
  }
`;

const HeroInner = styled.div`
  max-width: 480px;
  border-radius: 12px;
  padding: 48px 0 40px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 600px) {
    padding: 28px 0 24px 0;
    max-width: 100%;
  }
`;

const HeroHeading = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #5b4a44;
  margin: 0 0 12px 0;
  line-height: 1.1;
  letter-spacing: -1px;
  @media (max-width: 600px) {
    font-size: 32px;
  }
`;

const Highlight = styled.span`
  color: #e5a6a6;
`;

const HeroSubtitle = styled.p`
  font-size: 22px;
  color: #5b4a44;
  margin: 0 0 18px 0;
  font-weight: 400;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const HeroOfferRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
`;

const DiscountBadge = styled.span`
  background: #c8bfe7;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  border-radius: 7px;
  padding: 7px 22px;
  display: inline-block;
  margin-right: 8px;
`;

const OfferText = styled.span`
  color: #5b4a44;
  font-size: 18px;
  font-weight: 400;
`;

const ShopNowBtn = styled(Button)`
  margin-top: 10px;
  font-size: 20px;
  font-weight: 700;
  padding: 12px 38px;
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  background: #fff;
  color: #5b4a44;
  border: none;
  &:hover {
    background: #f7f7f7;
    color: #e5a6a6;
  }
`;

const FeaturedSection = styled.section`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 32px;
    width: 100%;
  }
`;

const TextSliderWrapper = styled.div`
  width: 100%;
  margin: 0 0 32px 0;
  overflow: hidden;
  background: #fff;
  display: flex;
  justify-content: center;
  padding: 30px 0;
`;

const TextSlider = styled.div`
  width: 100vw;
  max-width: 1320px;
  overflow: hidden;
  position: relative;
  height: 54px;
  display: flex;
  align-items: center;
`;

const TextSliderTrack = styled.div`
  display: flex;
  align-items: center;
  animation: scrollTextSlider 22s linear infinite;
  @keyframes scrollTextSlider {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

const TextSliderItem = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ $highlight }) => ($highlight ? '#f7b7a3' : '#5b4a44')};
  margin: 0 60px;
  font-family: 'Montserrat', sans-serif;
  opacity: ${({ $highlight }) => ($highlight ? 1 : 0.85)};
  transition: color 0.2s;
  white-space: nowrap;
  letter-spacing: -1px;
  @media (max-width: 700px) {
    font-size: 1.1rem;
    margin: 0 24px;
  }
`;

const PromoBanner = styled.div`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto 40px auto;
  display: flex;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 18px rgba(0,0,0,0.06);
  overflow: hidden;
  min-height: 380px;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 0;
  }
`;

const PromoImage = styled.img`
  flex: 1;
  min-width: 320px;
  object-fit: cover;
  background: #f9f9f9;
  @media (max-width: 900px) {
    width: 100%;
    height: 180px;
    min-width: 0;
  }
`;

const PromoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 48px 48px 48px;
  background: #fff;
  @media (max-width: 900px) {
    padding: 28px 18px;
  }
`;

const PromoTitle = styled.div`
  font-size: 2.3rem;
  font-weight: 900;
  margin-bottom: 10px;
  line-height: 1.1;
  display: flex;
  flex-direction: column;
  gap: 0;
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const PromoTitlePink = styled.span`
  color: #e5a6a6;
  font-weight: 900;
  font-family: 'Montserrat', sans-serif;
`;

const PromoTitlePurple = styled.span`
  color: #b49be0;
  font-weight: 900;
  margin-top: -2px;
`;

const PromoDesc = styled.div`
  font-size: 18px;
  color: #444;
  margin-bottom: 18px;
  max-width: 480px;
  font-weight: 400;
`;

const PromoOffer = styled.div`
  font-size: 2.2rem;
  font-weight: 900;
  color: #222;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PromoOfferLabel = styled.span`
  font-weight: 900;
  color: #222;
`;

const PromoOfferHighlight = styled.span`
  color: #e5a6a6;
  font-weight: 900;
  margin-left: 8px;
`;

const PromoSub = styled.div`
  font-size: 18px;
  color: #444;
  margin-bottom: 22px;
  b {
    color: #222;
    font-weight: 700;
  }
`;

const PromoHighlight = styled.span`
  color: #b49be0;
  font-weight: 700;
`;

const PromoButton = styled(Button)`
  margin-top: 18px;
  min-width: 140px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 7px;
  background: #fff;
  color: #5b4a44;
  border: 1.5px solid #e5a6a6;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  &:hover {
    background: #f7f7f7;
    color: #e5a6a6;
    border-color: #e5a6a6;
  }
`;

export default HomePage;