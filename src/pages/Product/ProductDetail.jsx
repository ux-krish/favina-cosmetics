import { createGlobalStyle , styled} from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { addToCart } from '../../redux/slices/cartSlice';
import Button from '../../components/common/Button';
import productData from '../../data/product.json';
// Add Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import { useForm } from 'react-hook-form';
import ProductGrid from '../../components/product/ProductGrid';
import { useImageBasePath } from '../../context/ImagePathContext';
import PromoBanner, { BannerHighlight } from '../../components/common/PromoBanner';
import promoImg from '../../assets/images/main-bg1.png';
import { useAuth } from '../../redux/hooks';

const SwiperNavStyles = createGlobalStyle`
  .product-detail-swiper .swiper-button-next,
  .product-detail-swiper .swiper-button-prev {
    width: 30px !important;
    height: 30px !important;
    min-width: 30px !important;
    min-height: 30px !important;
    max-width: 30px !important;
    max-height: 30px !important;
    border-radius: 50%;
    background: #fff;
    color: #e74c3c;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    font-size: 16px !important;
    top: 40%;
  }
  .product-detail-swiper .swiper-button-next:after,
  .product-detail-swiper .swiper-button-prev:after {
    font-size: 16px !important;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { register: formRegister, handleSubmit, reset, formState: { errors } } = useForm();
  const imageBasePath = useImageBasePath();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Find product by id from productData
    if (!id) return;
    const found = Array.isArray(productData.products)
      ? productData.products.find(p => String(p.id) === String(id))
      : null;
    setProduct(found || null);
    setLoading(false);
  }, [id]);

  // Load user reviews from localStorage for this product
  useEffect(() => {
    if (product) {
      // Store reviews as an object keyed by userId for this product
      const saved = JSON.parse(localStorage.getItem(`reviews_${product.id}`) || '{}');
      setUserReviews(saved);
    }
  }, [product]);

  // Helper to get/set cart for current user in localStorage
  const getUserCart = () => {
    if (!user?.id) return [];
    const allCarts = JSON.parse(localStorage.getItem('carts') || '{}');
    const arr = Array.isArray(allCarts[user.id]) ? allCarts[user.id] : [];
    return arr;
  };
  const setUserCart = (cartItems) => {
    if (!user?.id) return;
    const allCarts = JSON.parse(localStorage.getItem('carts') || '{}');
    allCarts[user.id] = cartItems;
    localStorage.setItem('carts', JSON.stringify(allCarts));
    window.dispatchEvent(new Event('cartChanged'));
  };

  const handleAddToCart = () => {
    if (!product) return;
    let updatedCart;
    const userCart = getUserCart();
    const exists = userCart.find(item => item.id === product.id);
    if (exists) {
      updatedCart = userCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...userCart, { ...product, quantity }];
    }
    if (isAuthenticated) {
      setUserCart(updatedCart);
    }
    dispatch(addToCart({ ...product, quantity }));
    window.dispatchEvent(new Event('cartChanged'));
  };

  // Handle review form submit
  const onSubmitReview = (data) => {
    if (!user?.id) {
      navigate('/login', { replace: true });
      return;
    }
    const newReview = {
      name: user.firstName || user.email || "User",
      text: data.text,
      avatar: user.avatar || `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`,
      userId: user.id
    };
    // Store reviews as an object keyed by userId
    const updated = { ...userReviews, [user.id]: newReview };
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

  // Combine user reviews (object values) and product testimonials for the Swiper
  const allTestimonials = [
    ...Object.values(userReviews || {}),
    ...(product.testimonials || []),
  ];

  return (
    <>
      <SwiperNavStyles />
      <ProductDetailContainer className="container">
        <ProductImageContainer>
          {/* --- Product Images Swiper with Thumbs --- */}
          {product.images && product.images.length > 0 ? (
            <>
              <Swiper
                modules={[Thumbs, Navigation]}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                spaceBetween={10}
                slidesPerView={1}
                style={{ width: '100%', maxWidth: 420, marginBottom: 16 }}
                className="product-detail-swiper"
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <ProductImage
                      src={
                        img.startsWith('/') || img.startsWith('http')
                          ? img
                          : `${imageBasePath}/${img}`
                      }
                      alt={product.title}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={Math.min(product.images.length, 5)}
                watchSlidesProgress
                style={{ width: '100%', maxWidth: 420 }}
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <ThumbImage
                      src={
                        img.startsWith('/') || img.startsWith('http')
                          ? img
                          : `${imageBasePath}/${img}`
                      }
                      alt={`thumb-${idx}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <ProductImage
              src={
                product.image
                  ? product.image.startsWith('/')
                    ? product.image
                    : product.image.startsWith('products/')
                      ? `${imageBasePath}/${product.image.replace(/^products\//, '')}`
                      : !product.image.includes('/') && product.image
                        ? `${imageBasePath}/${product.image}`
                        : `${imageBasePath}/${product.image}`
                  : ''
              }
              alt={product.title}
            />
          )}
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

      <PromoBanner
        image={promoImg}
        titlePink="Special Offer"
        titlePurple="On This Product"
        desc="Enjoy an exclusive discount on this product for a limited time only. Hurry up before the offer ends!"
        offerLabel="Save"
        offerHighlight="50% OFF"
        sub={
          <>
            Use code <BannerHighlight>GLOW15</BannerHighlight> at checkout.<br />
            Offer valid for <BannerHighlight>today only!</BannerHighlight>
          </>
        }
        buttonText="Buy Now"
        buttonTo="/checkout"
      />

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
          <ReviewForm
            onSubmit={handleSubmit(onSubmitReview)}
            onFocus={() => {
              if (!isAuthenticated) {
                navigate('/login', { replace: true });
              }
            }}
          >
            {/* Show logged in user name instead of input */}
            {isAuthenticated && user?.firstName ? (
              <ReviewInput
                type="text"
                value={user.firstName}
                disabled
                readOnly
                style={{ background: "#f5f5f5", color: "#888" }}
              />
            ) : (
              <ReviewInput
                type="text"
                placeholder="Your Name"
                {...formRegister('name', { required: 'Name is required' })}
              />
            )}
            {errors.name && !isAuthenticated && <ReviewError>{errors.name.message}</ReviewError>}
            <ReviewTextarea
              placeholder="Your Review"
              {...formRegister('text', { required: 'Review is required', minLength: { value: 5, message: 'Review must be at least 5 characters' } })}
              rows={3}
            />
            {errors.text && <ReviewError>{errors.text.message}</ReviewError>}
            <ReviewButton type="submit" disabled={!isAuthenticated}>
              {isAuthenticated ? "Submit Review" : "Login to Review"}
            </ReviewButton>
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  background: #fff;
`;

const ThumbImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 6px;
  border: 2px solid #eee;
  background: #fff;
  cursor: pointer;
  transition: border 0.18s;
  &:hover {
    border: 2px solid #e74c3c;
  }
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
  width: 100%;
  height: 320px;
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