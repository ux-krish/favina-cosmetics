import styled from 'styled-components';
import { pxToRem, fontSizes, colors, fonts } from '../../assets/styles/theme';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import RatingBox from '../../components/common/RatingBox';
import React from 'react';

const CustomTestimonialSectionWrapper = styled.section`
  overflow: hidden;
  margin: ${pxToRem(70)} auto 0 auto;
  min-height: ${pxToRem(340)};
  width: 100%;
  padding: ${pxToRem(0)} ${pxToRem(20)};
  @media (max-width: 1099px) {
    flex-direction: column;
    min-height: 0;
  }
`;
const TestimonialContainer = styled.div`
  box-shadow: 0 2px 18px rgba(0,0,0,0.06);
  border-radius: ${pxToRem(10)};
  display: flex;
  width: 100%;
  margin: auto;
  @media (max-width: 1099px) {
    flex-direction: column;
  }
`;
const TestimonialTitle = styled.h2`
  font-size: ${fontSizes.xl};
  color: ${colors.text};
  font-weight: 800;
  margin-bottom: ${pxToRem(24)};
  text-align: center;
  @media (max-width: 1099px) {
    font-size: ${fontSizes.lg}; 
    margin-bottom: ${pxToRem(16)};
  }
`;
const TestimonialLeft = styled.div`
  width: 50%;
  background: #fbeaec;
  padding: 48px 38px 38px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px 0 0 10px;
  @media (max-width: 1099px) {
    width: 100%;
    padding: 28px 18px 18px 18px;
  }
`;
const TestimonialRating = styled.div`
  margin-bottom: 18px;
`;
const TestimonialSlide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 320px;
  padding: 0 10px;
`;
const TestimonialQuote = styled.div`
  font-size: 2rem;
  font-family: ${fonts.title};
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: ${pxToRem(18)};
`;
const TestimonialText = styled.div`
  font-size: ${pxToRem(17)};
  font-family: ${fonts.body};
  color: ${colors.text};
  margin-bottom: 22px;
  max-width: 600px;
`;
const TestimonialUser = styled.div`
  font-size: 16px;
  color: ${colors.text};
  margin-bottom: 18px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;
const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #e7b86a;
  font-size: 14px;
  margin-left: 8px;
`;
const VerifiedIcon = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
`;
const TestimonialRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 38px 28px;
  background: #fff;
  border-radius: 0 10px 10px 0;
  @media (max-width: 1099px) {
    padding: 24px 12px;
  }
`;
const ProductImg = styled.img`
  width: 100%;
  height: 320px;
  object-fit: contain;
  margin-bottom: 28px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(231,76,60,0.08);
`;
const FeatureList = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
`;
const Feature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;
const FeatureIcon = styled.img`
  width: 54px;
  height: 54px;
  object-fit: contain;
  margin-bottom: 4px;
`;
const FeatureText = styled.div`
  font-size: 15px;
  color: #b49be0;
  font-weight: 600;
  text-align: center;
`;

const CustomTestimonialSection = ({
  testimonialSlides = [],
  product,
  imageBasePath
}) => (
  <CustomTestimonialSectionWrapper>
    <TestimonialTitle>Customer Reviews</TestimonialTitle>
    <TestimonialContainer>
      <TestimonialLeft>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop={true}
          speed={600}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          style={{ maxWidth: 600, width: '100%' }}
        >
          {testimonialSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <TestimonialSlide>
                <TestimonialRating>
                  <RatingBox rating={slide.rating.toFixed(1)} />
                </TestimonialRating>
                <TestimonialQuote>
                  "{slide.quote}"
                </TestimonialQuote>
                <TestimonialText>
                  {slide.text}
                </TestimonialText>
                <TestimonialUser>
                  ~ {slide.user}
                  {slide.verified && (
                    <VerifiedBadge>
                      <VerifiedIcon>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="7.5" cy="7.5" r="7.5" fill="#F6C6A7"/>
                          <path d="M5.0285 8.03565L7.0635 9.98465L9.9985 5.01465" fill="#F6C6A7"/>
                          <path d="M5.0285 8.03565L7.0635 9.98465L9.9985 5.01465" stroke="#5A4E4D" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </VerifiedIcon>
                      Verified Buyers
                    </VerifiedBadge>
                  )}
                </TestimonialUser>
              </TestimonialSlide>
            </SwiperSlide>
          ))}
        </Swiper>
      </TestimonialLeft>
      <TestimonialRight>
        <ProductImg
          src={
            product.image
              ? product.image.startsWith('/')
                ? product.image
                : product.image.startsWith('products/')
                  ? `${imageBasePath}/${product.image.replace(/^products\//, '')}`
                  : !product.image.includes('/') && product.image
                    ? `${imageBasePath}/${product.image}`
                    : product.image
              : ''
          }
          alt="Product"
        />
        <FeatureList>
          <Feature>
            <FeatureIcon
              src={
                Array.isArray(product.images) && product.images.length > 0
                  ? (product.images[0].startsWith('/') || product.images[0].startsWith('http')
                      ? product.images[0]
                      : `${imageBasePath}/${product.images[0]}`
                    )
                  : (
                      product.image
                        ? product.image.startsWith('/')
                          ? product.image
                          : `${imageBasePath}/${product.image}`
                        : ''
                    )
              }
              alt="Product Feature"
            />
            <FeatureText>Product Preview</FeatureText>
          </Feature>
        </FeatureList>
      </TestimonialRight>
    </TestimonialContainer>
  </CustomTestimonialSectionWrapper>
);

export default CustomTestimonialSection;
