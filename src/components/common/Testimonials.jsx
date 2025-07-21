import styled from 'styled-components';
import { fonts, fontSizes, colors } from '../../assets/styles/theme';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import { useRef } from 'react';

const Testimonials = ({ testimonials = [], title = "What Our Customers Say", loop = true, autoplay = true }) => {
  if (!testimonials.length) return null;

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <TestimonialSection>
      <TestimonialTitle>{title}</TestimonialTitle>
      <TestimonialSwiperContainer>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={swiper => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          spaceBetween={24}
          slidesPerView={4}
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            900: { slidesPerView: 4 },
          }}
          style={{ paddingBottom: 40 }}
          loop={loop}
          speed={600}
          autoplay={
            autoplay
              ? {
                  delay: 10000, // 10 seconds
                  disableOnInteraction: false,
                }
              : false
          }
        >
          {testimonials.map((testimonial, idx) => (
            <SwiperSlide key={idx}>
              <TestimonialCard>
                {testimonial.avatar && (
                  <TestimonialAvatar src={testimonial.avatar} alt={testimonial.name} />
                )}
                <TestimonialText>{testimonial.text}</TestimonialText>
                <TestimonialName>
                  - {testimonial.name}
                  {testimonial.category && ` (${testimonial.category})`}
                  <VerifiedBadge>
                    <VerifiedIcon />
                    Verified Buyer
                  </VerifiedBadge>
                </TestimonialName>
              </TestimonialCard>
            </SwiperSlide>
          ))}
          <div
            ref={prevRef}
            className="testimonial-swiper-prev swiper-button-prev"
            tabIndex={0}
            role="button"
            aria-label="Previous slide"
          ></div>
          <div
            ref={nextRef}
            className="testimonial-swiper-next swiper-button-next"
            tabIndex={0}
            role="button"
            aria-label="Next slide"
          ></div>
        </Swiper>
      </TestimonialSwiperContainer>
    </TestimonialSection>
  );
};

const TestimonialSwiperContainer = styled.div`
  position: relative;
  .swiper{
    padding: 20px 0 0;
  }
`;


const TestimonialSection = styled.section`
  margin: 48px auto 0 auto;
  padding: 48px 20px 40px 20px;
  overflow: hidden;
  width: 100%;
  background: linear-gradient(120deg, #fbeaec 0%, #f8f3fa 100%);
  box-shadow: 0 4px 32px 0 rgba(160,132,202,0.10), 0 1.5px 8px 0 rgba(160,132,202,0.06);
  border: 1.5px solid #ede7f6;
`;

const TestimonialTitle = styled.h3`
  text-align: center;
  margin-bottom: 38px;
  font-size: ${fontSizes.xl};
  font-family: ${fonts.title};
  font-weight: 800;
  color: ${colors.text};
  letter-spacing: -1px;
  width: 100%;
`;

const TestimonialCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  background: linear-gradient(120deg, #fff 60%, #fbeaec 100%);
  border-radius: 18px;
  padding: 38px 28px 28px 28px;
  min-height: 200px;
  height: 200px;
  box-shadow: 0 6px 32px rgba(160,132,202,0.13), 0 1.5px 8px rgba(160,132,202,0.06);
  border: 1.5px solid #ede7f6;
  border-top: 5px solid ${colors.accent};
  transition: box-shadow 0.18s, border 0.18s, transform 0.18s;
  position: relative;
  margin-bottom: 8px;
  &:hover {
    box-shadow: 0 12px 36px rgba(160,132,202,0.18), 0 2px 12px rgba(160,132,202,0.10);
    border-color: ${colors.accent};
    border-top: 5px solid ${colors.primary};
    transform: translateY(-6px) scale(1.035);
  }
`;

const TestimonialAvatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 18px;
  border: 3px solid ${colors.accent};
  box-shadow: 0 2px 8px rgba(229,166,166,0.13);
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const TestimonialText = styled.div`
  font-size: ${fontSizes.md};
  font-family: ${fonts.body};
  color: #5A4E4D;
  margin-bottom: 16px;
  font-style: italic;
  line-height: 1.5;
  position: relative;
  text-align: left;
  &:before {
    content: '“';
    font-size: 2.2em;
    color: ${colors.accent};
    position: absolute;
    left: -18px;
    top: -18px;
    opacity: 0.18;
    font-family: ${fonts.title};
  }
  &:after {
    content: '”';
    font-size: 2.2em;
    color: ${colors.accent};
    position: absolute;
    right: -18px;
    bottom: -18px;
    opacity: 0.18;
    font-family: ${fonts.title};
  }
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8f3fa;
  color: #27ae60;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 10px 2px 6px;
  margin-left: 12px;
`;

const VerifiedIcon = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  background: url('https://cdn-icons-png.flaticon.com/512/190/190411.png') center/cover no-repeat;
`;

const TestimonialName = styled.div`
  font-size: ${fontSizes.base};
  font-family: ${fonts.title};
  color: ${colors.accent};
  font-weight: 700;
  margin-top: 8px;
  letter-spacing: 0.01em;
  display:flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export default Testimonials;
