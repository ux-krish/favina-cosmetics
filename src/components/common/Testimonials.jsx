import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const Testimonials = ({ testimonials = [], title = "What Our Customers Say", loop = true, autoplay = true }) => {
  if (!testimonials.length) return null;

  return (
    <TestimonialSection>
      <TestimonialTitle>{title}</TestimonialTitle>
      <Swiper
        modules={[Pagination]}
        spaceBetween={24}
        slidesPerView={4}
        pagination={{ clickable: true }}
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
                delay: 3500,
                disableOnInteraction: false,
              }
            : false
        }
      >
        {testimonials.map((testimonial, idx) => (
          <SwiperSlide key={idx}>
            <TestimonialCard>
              <TestimonialAvatar src={testimonial.avatar} alt={testimonial.name} />
              <TestimonialText>"{testimonial.text}"</TestimonialText>
              <TestimonialName>
                - {testimonial.name}
                {testimonial.category && ` (${testimonial.category})`}
              </TestimonialName>
            </TestimonialCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </TestimonialSection>
  );
};

const TestimonialSection = styled.section`
  max-width: 1320px;
  margin: 50px auto 0 auto;
  padding: 30px 20px;
  overflow: hidden;
  width: 100%;
`;

const TestimonialTitle = styled.h3`
  font-size: 24px;
  color: #e74c3c;
  margin-bottom: 18px;
  text-align: center;
`;

const TestimonialCard = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: center;
  text-align: center;
  background: #fff;
  border-radius: 10px;
  padding: 24px 16px 18px 16px;
  min-height: 220px;
  height: 220px;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.08);
`;

const TestimonialAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 18px;
  border: 2px solid #e74c3c;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const TestimonialText = styled.div`
  font-size: 16px;
  color: #444;
  margin-bottom: 12px;
  font-style: italic;
`;

const TestimonialName = styled.div`
  font-size: 15px;
  color: #e74c3c;
  font-weight: 500;
`;

export default Testimonials;
