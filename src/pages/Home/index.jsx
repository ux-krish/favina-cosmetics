import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ProductGrid from '../../components/product/ProductGrid';
import Button from '../../components/common/Button';
import Testimonials from '../../components/common/Testimonials';
import productData from '../../data/product.json';
import bannerImg from '../../assets/images/Banner.jpg';
import { useImageBasePath } from '../../context/ImagePathContext';
import TextSliderWrapper from '../../components/common/TextSliderWrapper';
import PromoBanner, { BannerHighlight } from '../../components/common/PromoBanner';
import promoImg from '../../assets/images/main-bg1.png';

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

      <TextSliderWrapper messages={sliderMessages} />

      <PromoBanner
        image={promoImg}
        titlePink="Limited Edition"
        titlePurple="Unlimited Glam"
        desc="Unveil your beauty with our exclusive launch offer on premium nail polish shades."
        offerLabel="Flat"
        offerHighlight="30% OFF"
        sub={
          <>
            on your first purchase<br />
            for the next <BannerHighlight>24 hours</BannerHighlight> only!
          </>
        }
        buttonText="Shop Now"
        buttonTo="/products"
      />

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

export default HomePage;