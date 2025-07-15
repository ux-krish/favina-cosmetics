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
      <div style={{ position: 'relative' }}>
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
                <TestimonialText>"{testimonial.text}"</TestimonialText>
                <TestimonialName>
                  - {testimonial.name}
                  {testimonial.category && ` (${testimonial.category})`}
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
      </div>
    </TestimonialSection>
  );
};

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
  align-items: center;
  text-align: center;
  background: #fff;
  border-radius: 3px;
  padding: 32px 24px 24px 24px;
  min-height: 260px;
  height: 260px;
  box-shadow: 0 4px 24px rgba(160,132,202,0.10), 0 1.5px 8px rgba(160,132,202,0.06);
  border: 1.5px solid #ede7f6;
  transition: box-shadow 0.18s, border 0.18s, transform 0.18s;
  position: relative;
  &:hover {
    box-shadow: 0 8px 32px rgba(160,132,202,0.18), 0 2px 12px rgba(160,132,202,0.10);
    border-color: ${colors.accent};
    transform: translateY(-4px) scale(1.025);
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

const TestimonialName = styled.div`
  font-size: ${fontSizes.base};
  font-family: ${fonts.title};
  color: ${colors.accent};
  font-weight: 700;
  margin-top: 8px;
  letter-spacing: 0.01em;
`;

export default Testimonials;
