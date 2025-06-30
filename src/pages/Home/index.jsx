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
import { Link } from 'react-router-dom';

const sliderMessages = [
  { text: "Limited Time Only", highlight: true },
  { text: "Flat 30% Off", highlight: false },
  { text: "Free Gift Inside", highlight: true },
  { text: "Hot Deal Alert", highlight: false },
  { text: "Exclusive Online Offer", highlight: true },
  { text: "Glow & Save", highlight: false }
];

const beautyPicks = [
  {
    image: '/assets/images/beauty-pick-1.png',
    label: 'On Best Seller',
    offer: 'Up To 20% Off',
    to: '/products',
    desc: '',
  },
  {
    image: '/assets/images/beauty-pick-2.png',
    label: 'Sampoo and Mask',
    offer: 'Up To 30% Off',
    to: '/products',
    desc: '',
  },
  {
    image: '/assets/images/beauty-pick-3.png',
    label: 'On Kay Bestseller',
    offer: 'Up To 40% Off',
    to: '/products',
    desc: '',
  },
  {
    image: '/assets/images/beauty-pick-4.png',
    label: 'On Best Seller',
    offer: 'Up To 35% Off',
    to: '/products',
    desc: '',
  },
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

       <BeautyPicksSection>
        <BeautyPicksTitle>
          <span style={{ color: '#e5a6a6', fontWeight: 700 }}>Beauty Picks</span>
          <span style={{ color: '#5b4a44', fontWeight: 900 }}> for Every Mood</span>
        </BeautyPicksTitle>
        <BeautyPicksGrid>
          {beautyPicks.map((pick, idx) => (
            <BeautyPickCard as={Link} to={pick.to} key={idx}>
              <BeautyPickImg src={pick.image} alt={pick.label} />
              <BeautyPickOverlay>
                <BeautyPickLabel>
                  {pick.label}
                  <BeautyPickShopBtn
              BeautyPickCarde="beauty-pick-shop-btn"
                    tabIndex={-1}
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      window.location.href = pick.to;
                    }}
                  >
                    Shop Now
                  </BeautyPickShopBtn>
                </BeautyPickLabel>
                <BeautyPickOffer>{pick.offer}</BeautyPickOffer>
              </BeautyPickOverlay>
            </BeautyPickCard>
          ))}
        </BeautyPicksGrid>
      </BeautyPicksSection>

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

const BeautyPicksSection = styled.section`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto 40px auto;
  padding: 0 0 0 0;
`;

const BeautyPicksTitle = styled.h2`
  text-align: center;
  font-size: 2.4rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  margin-bottom: 32px;
  letter-spacing: -1px;
`;

const BeautyPicksGrid = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
  @media (max-width: 900px) {
    gap: 18px;
  }
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 18px;
    align-items: center;
  }
`;

const BeautyPickCard = styled(Link)`
  display: block;
  position: relative;
  flex: 1;
  width: 100%;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 18px rgba(0,0,0,0.08);
  background: #f9f9f9;
  text-decoration: none;
  transition: box-shadow 0.18s, transform 0.18s;
  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
    transform: translateY(-2px) scale(1.01);
  }
  &:hover .beauty-pick-shop-btn {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  @media (max-width: 700px) {
    width: 100%;
    max-width: 340px;
    height: 180px;
  }
`;

const BeautyPickImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const BeautyPickOverlay = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0 0 24px 24px;
  background: linear-gradient(0deg, rgba(0,0,0,0.32) 60%, rgba(0,0,0,0.01) 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const BeautyPickLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 2px;
  position: relative;
`;

const BeautyPickOffer = styled.div`
  font-size: 1.3rem;
  font-weight: 900;
  color: #fff;
`;

const BeautyPickShopBtn = styled.button`
  position: absolute;
  left: 0;
  bottom: 100%;
  margin-top: 10px;
  background: #fff;
  color: #e74c3c;
  border: none;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 700;
  padding: 7px 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  opacity: 0;
  transform: translateY(-200px);
  pointer-events: none;
  transition: opacity 0.28s cubic-bezier(.4,0,.2,1), transform 0.28s cubic-bezier(.4,0,.2,1);
  z-index: 2;
  &:hover {
    background: #ffecec;
    color: #c0392b;
  }
`;

export default HomePage;