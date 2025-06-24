import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import Button from '../../components/common/Button';
import productData from '../../data/product.json';
// Add Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useForm } from 'react-hook-form';
import ProductGrid from '../../components/product/ProductGrid';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);
  const { register: formRegister, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    // Find product by id from productData
    const found = (productData.products || []).find(
      p => String(p.id) === String(id)
    );
    setProduct(found || null);
    setLoading(false);
  }, [id]);

  // Load user reviews from localStorage for this product
  useEffect(() => {
    if (product) {
      const saved = JSON.parse(localStorage.getItem(`reviews_${product.id}`) || '[]');
      setUserReviews(saved);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
    }
  };

  // Handle review form submit
  const onSubmitReview = (data) => {
    const newReview = {
      name: data.name,
      text: data.text,
      avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`,
    };
    const updated = [newReview, ...userReviews];
    setUserReviews(updated);
    localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
    reset();
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  // Related products: same category, exclude current product
  const relatedProducts = (productData.products || [])
    .filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id
    )
    .slice(0, 4);

  // Example testimonial slides for the slider (replace with your own data as needed)
  const testimonialSlides = [
    {
      rating: 5.0,
      quote: "Perfect nude colour",
      text: "First-ever purchase from kay beauty...and it is so good. ROCKY ROAD beautiful nude colour as you can see in the pictures...I want this colour and finally got this. Luxurious finish gives a nice shine colour pay-off is excellent...but one thing is it takes a lot of time to dry otherwise, I love this ❤️",
      user: "Juhi Bhaskar",
      verified: true,
    },
    {
      rating: 4.8,
      quote: "Amazing texture",
      text: "The texture is so smooth and blends perfectly. Will buy again!",
      user: "Aarti P.",
      verified: true,
    },
    {
      rating: 4.9,
      quote: "Long lasting",
      text: "Stayed on my lips all day, even after meals. Highly recommend.",
      user: "Priya S.",
      verified: true,
    },
    {
      rating: 5.0,
      quote: "Best purchase",
      text: "Absolutely love the color and finish. Worth every penny.",
      user: "Sneha T.",
      verified: true,
    },
    {
      rating: 4.7,
      quote: "Great for daily use",
      text: "Perfect for my daily makeup routine. Not heavy at all.",
      user: "Tanvi P.",
      verified: true,
    },
  ];

  // Combine user reviews and product testimonials for the Swiper
  const allTestimonials = [
    ...userReviews,
    ...(product.testimonials || []),
  ];

  return (
    <>
      <ProductDetailContainer className="container">
        <ProductImageContainer>
          <BackButton type="button" onClick={() => navigate(-1)}>
            ← Back
          </BackButton>
          <ProductImage
            src={
              product.image
                ? product.image.startsWith('/')
                  ? product.image
                  : product.image.startsWith('products/')
                    ? `/images/${product.image.replace(/^products\//, '')}`
                    : !product.image.includes('/') && product.image
                      ? `/images/${product.image}`
                      : `/images/${product.image}`
                : ''
            }
            alt={product.title}
          />
        </ProductImageContainer>
        <ProductInfo>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductRating>
            <Star>★</Star>
            <RatingValue>{product.rating ? product.rating.toFixed(1) : '4.0'}</RatingValue>
          </ProductRating>
          <ProductPrice>
            {product.offerPrice && product.offerPrice < product.price ? (
              <>
                <RegularPrice>${product.price.toFixed(2)}</RegularPrice>
                <OfferPrice>${product.offerPrice.toFixed(2)}</OfferPrice>
              </>
            ) : (
              <>${product.price.toFixed(2)}</>
            )}
          </ProductPrice>
          <ProductDescription>
            {/* You can add a description field in product.json if needed */}
            This is a detailed description of the product.
          </ProductDescription>
          <QuantityControl>
            <QuantityButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</QuantityButton>
            <QuantityInput 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
            <QuantityButton onClick={() => setQuantity(quantity + 1)}>+</QuantityButton>
          </QuantityControl>
          <Button onClick={handleAddToCart} fullWidth>
            Add to Cart
          </Button>
        </ProductInfo>
      </ProductDetailContainer>
      <DiscountBanner className="container">
        <DiscountImage />
        <DiscountContent>
          <DiscountTitle>Discount</DiscountTitle>
          <DiscountDesc>
            Nourish your skin with toxin-free cosmetic products. With the offers that you can’t refuse.
          </DiscountDesc>
          <DiscountOffer>
            <span>Get Your</span> <Highlight>50% Off</Highlight>
          </DiscountOffer>
          <DiscountSub>
            on your first purchase<br />
            for the next <b>24 hours only!</b>
          </DiscountSub>
          <Button variant="outline" style={{ marginTop: 24, minWidth: 120 }}>Get Now</Button>
        </DiscountContent>
      </DiscountBanner>
      <ReviewsSection className="container">
        <ReviewsTitle>Customer Reviews & Ratings</ReviewsTitle>
        {/* Swiper for all testimonials (user + product) */}
        {allTestimonials.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={true}
            speed={600}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            style={{ paddingBottom: 40, maxWidth: 600 }}
          >
            {allTestimonials.map((review, idx) => (
              <SwiperSlide key={idx}>
                <ReviewItem>
                  <ReviewAvatar src={review.avatar} alt={review.name} />
                  <ReviewContent>
                    <ReviewName>{review.name}</ReviewName>
                    <ReviewText>"{review.text}"</ReviewText>
                  </ReviewContent>
                </ReviewItem>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <NoReviews>No reviews yet for this product.</NoReviews>
        )}
        {/* --- Write a Review Section --- */}
        <WriteReviewBox>
          <WriteReviewTitle>Write a Review</WriteReviewTitle>
          <ReviewForm onSubmit={handleSubmit(onSubmitReview)}>
            <ReviewInput
              type="text"
              placeholder="Your Name"
              {...formRegister('name', { required: 'Name is required' })}
            />
            {errors.name && <ReviewError>{errors.name.message}</ReviewError>}
            <ReviewTextarea
              placeholder="Your Review"
              {...formRegister('text', { required: 'Review is required', minLength: { value: 5, message: 'Review must be at least 5 characters' } })}
              rows={3}
            />
            {errors.text && <ReviewError>{errors.text.message}</ReviewError>}
            <ReviewButton type="submit">Submit Review</ReviewButton>
          </ReviewForm>
        </WriteReviewBox>
      </ReviewsSection>
      <CustomTestimonialSection className="container">
        <TestimonialLeft>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={true}
            speed={600}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            style={{ maxWidth: 600, width: '100%' }}
          >
            {testimonialSlides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <TestimonialSlide>
                  <TestimonialRating>
                    <RatingBox>
                      {slide.rating.toFixed(1)} <StarIcon>★</StarIcon>
                    </RatingBox>
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
                        <VerifiedIcon />
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
                    ? `/images/${product.image.replace(/^products\//, '')}`
                    : !product.image.includes('/') && product.image
                      ? `/images/${product.image}`
                      : product.image
                : ''
            }
            alt="Product"
          />
          <FeatureList>
            <Feature>
              <FeatureIcon src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" alt="30H Wear" />
              <FeatureText>30H WEAR</FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon src="https://cdn-icons-png.flaticon.com/512/1828/1828885.png" alt="Weightless" />
              <FeatureText>WEIGHTLESS</FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon src="https://cdn-icons-png.flaticon.com/512/1828/1828886.png" alt="Sweatproof" />
              <FeatureText>SWEATPROOF</FeatureText>
            </Feature>
          </FeatureList>
        </TestimonialRight>
      </CustomTestimonialSection>
      {/* --- Related Products Section --- */}
      <RelatedSection className="container">
        <RelatedTitle>Related Products</RelatedTitle>
        <ProductGrid products={relatedProducts} />
      </RelatedSection>
      {/* --- End Related Products Section --- */}
    </>
  );
};

const ProductDetailContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px 0;
  max-width: 1320px;
  margin: 0 auto;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`;

const ProductImageContainer = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProductTitle = styled.h1`
  font-size: 28px;
  margin: 0;
`;

const ProductCategory = styled.span`
  color: #666;
  text-transform: capitalize;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Star = styled.span`
  color: #ffc107;
  font-size: 18px;
`;

const RatingValue = styled.span`
  color: #333;
  font-size: 16px;
  font-weight: 500;
`;

const ProductPrice = styled.div`
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RegularPrice = styled.span`
  color: #888;
  text-decoration: line-through;
  font-size: 18px;
`;

const OfferPrice = styled.span`
  color: #e74c3c;
  font-size: 24px;
  font-weight: bold;
`;

const ProductDescription = styled.p`
  line-height: 1.6;
  color: #333;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const BackButton = styled.button`
  position: absolute;
 
  left: 10px;
  background: #fff;
  border: 1px solid #eee;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  padding: 7px 18px 7px 10px;
  border-radius: 22px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 10;
  display: flex;
  align-items: center;
  transition: color 0.18s, border 0.18s, background 0.18s;
  &:hover {
    color: #e74c3c;
    border-color: #e74c3c;
    background: #fff7f5;
  }
`;

/* --- Reviews & Ratings Section Styles --- */
const ReviewsSection = styled.div`
  margin-top: 32px;
  padding: 24px 0 0 0;
  border-top: 1px solid #eee;
  max-width: 1320px;
  margin-left: auto;
  margin-right: auto;
`;

const ReviewsTitle = styled.h3`
  font-size: 20px;
  color: #e74c3c;
  margin:0 a 18px;
  text-align: center;
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ReviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
  background: #fafafa;
  border-radius: 8px;
  padding: 14px 16px;
`;

const ReviewAvatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e74c3c;
`;

const ReviewContent = styled.div`
  flex: 1;
`;

const ReviewName = styled.div`
  font-weight: 500;
  color: #222;
  margin-bottom: 3px;
  font-size: 15px;
`;

const ReviewText = styled.div`
  color: #444;
  font-size: 15px;
  font-style: italic;
`;

const NoReviews = styled.div`
  color: #888;
  font-size: 15px;
  padding: 10px 0;
`;

/* --- Discount Banner Section Styles --- */
const DiscountBanner = styled.div`
  display: flex;
  align-items: stretch;
  background: #fdf3f1;
  border-radius: 14px;
  margin: 40px auto 0 auto;
  overflow: hidden;
  min-height: 320px;
  box-shadow: 0 2px 12px rgba(231,76,60,0.06);
  max-width: 1320px;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 0;
  }
`;

const DiscountImage = styled.div`
  flex: 1.2;
  min-width: 260px;
  background: url('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80') center/cover no-repeat;
  @media (max-width: 900px) {
    min-height: 180px;
    min-width: 0;
    height: 180px;
  }
`;

const DiscountContent = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 38px 38px 38px 38px;
  background: #fdf3f1;
  @media (max-width: 900px) {
    padding: 24px 18px;
  }
`;

const DiscountTitle = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #b49be0;
  margin-bottom: 10px;
  font-style: italic;
`;

const DiscountDesc = styled.div`
  font-size: 20px;
  color: #444;
  margin-bottom: 18px;
  max-width: 480px;
`;

const DiscountOffer = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 10px;
  span {
    font-weight: 700;
  }
`;

const Highlight = styled.span`
  color: #f08a6b;
  font-weight: 900;
`;

const DiscountSub = styled.div`
  font-size: 18px;
  color: #444;
  margin-bottom: 18px;
  b {
    color: #222;
    font-weight: 700;
  }
`;

/* --- Custom Testimonial Section Styles --- */
const CustomTestimonialSection = styled.section`
  display: flex;
  background: linear-gradient(120deg, #fbeaec 0%, #f8f3fa 100%);
  border-radius: 16px;
  margin: 40px auto 0 auto;
  overflow: hidden;
  min-height: 340px;
  box-shadow: 0 2px 12px rgba(231,76,60,0.06);
  max-width: 1320px;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 0;
  }
`;

const TestimonialLeft = styled.div`
  flex: 1.2;
  padding: 48px 38px 38px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 900px) {
    padding: 28px 18px 18px 18px;
  }
`;

const TestimonialRating = styled.div`
  margin-bottom: 18px;
`;

const RatingBox = styled.div`
  display: inline-flex;
  align-items: center;
  background: #fff;
  color: #222;
  font-weight: 700;
  font-size: 20px;
  border-radius: 8px;
  padding: 6px 18px;
  box-shadow: 0 2px 8px rgba(231,76,60,0.08);
`;

const StarIcon = styled.span`
  color: #ffc107;
  font-size: 20px;
  margin-left: 6px;
`;

const TestimonialQuote = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 18px;
  font-family: 'Montserrat', sans-serif;
`;

const TestimonialText = styled.div`
  font-size: 17px;
  color: #444;
  margin-bottom: 22px;
  max-width: 600px;
`;

const TestimonialUser = styled.div`
  font-size: 16px;
  color: #222;
  margin-bottom: 18px;
  display: flex;
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
  background: url('https://cdn-icons-png.flaticon.com/512/190/190411.png') center/cover no-repeat;
`;

const TestimonialNav = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 18px;
`;

const NavBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #fff;
  border: none;
  font-size: 20px;
  color: #e74c3c;
  box-shadow: 0 2px 8px rgba(231,76,60,0.08);
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #ffecec;
  }
`;

const TestimonialRight = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 38px 28px;
  background: #fff;
  @media (max-width: 900px) {
    padding: 24px 12px;
  }
`;

const ProductImg = styled.img`
  width: 180px;
  height: 220px;
  object-fit: contain;
  margin-bottom: 28px;
  border-radius: 12px;
  background: #f8f3fa;
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

const WriteReviewBox = styled.div`
  padding: 24px 18px;
  background: #f8f8f8;
  border-radius: 10px;
  max-width: 600px;
  margin: 24px auto 0;
`;

const WriteReviewTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #e74c3c;
  margin-bottom: 12px;
`;

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReviewInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 15px;
`;

const ReviewTextarea = styled.textarea`
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 15px;
  min-height: 70px;
  resize: vertical;
`;

const ReviewButton = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.18s;
  &:hover {
    background: #c0392b;
  }
`;

const ReviewError = styled.div`
  color: #e74c3c;
  font-size: 13px;
  margin-top: -6px;
`;

const TestimonialSlide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 320px;
  padding: 0 10px;
`;

const RelatedSection = styled.section`
  margin: 40px auto 0 auto;
  max-width: 1320px;
  padding-bottom: 40px;
`;

const RelatedTitle = styled.h3`
  font-size: 22px;
  color: #e74c3c;
  margin-bottom: 24px;
  text-align: center;
`;

export default ProductDetail;