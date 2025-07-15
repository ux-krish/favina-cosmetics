import { createGlobalStyle , styled} from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { addToCart, toggleCart } from '../../redux/slices/cartSlice';
import Button from '../../components/common/Button';
import productData from '../../data/product.json';
// Add Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import { useForm } from 'react-hook-form';
import ProductGrid from '../../components/product/ProductGrid';
import { useImageBasePath } from '../../context/ImagePathContext';
import PromoBanner, { BannerHighlight } from '../../components/common/PromoBanner';
import promoImg from '../../assets/images/main-bg2.png';
import { useAuth } from '../../redux/hooks';
import { FaHeart } from 'react-icons/fa';
import { colors, fontSizes, pxToRem, fonts } from '../../assets/styles/theme.js';

const SwiperNavStyles = createGlobalStyle`
  .product-detail-swiper .swiper-button-next,
  .product-detail-swiper .swiper-button-prev {
    width: ${pxToRem(30)} !important;
    height: ${pxToRem(30)} !important;
    min-width: ${pxToRem(30)} !important;
    min-height: ${pxToRem(30)} !important;
    max-width: ${pxToRem(30)} !important;
    max-height: ${pxToRem(30)} !important;
    border-radius: 50%;
    background: #fff;
    color: ${colors.primary};
    box-shadow: 0 ${pxToRem(2)} ${pxToRem(8)} rgba(0,0,0,0.08);
    font-size: ${pxToRem(16)} !important;
    top: 40%;
  }
  .product-detail-swiper .swiper-button-next:after,
  .product-detail-swiper .swiper-button-prev:after {
    font-size: ${pxToRem(16)} !important;
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
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const { register: formRegister, handleSubmit, reset, formState: { errors } } = useForm();
  const imageBasePath = useImageBasePath();
  const { isAuthenticated, user } = useAuth();
  // Wishlist state and toast
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
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
    dispatch(toggleCart()); 
  };

  // --- Buy Now handler ---
  const handleBuyNow = () => {
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
    
    navigate('/checkout');
  };


  // Helper to get/set wishlist as array of product IDs in localStorage per user
  const getUserWishlist = () => {
    if (!user?.id) return [];
    const allWishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
    const arr = Array.isArray(allWishlists[user.id]) ? allWishlists[user.id] : [];
    return arr.filter(id => !!id);
  };
  const setUserWishlist = (list) => {
    if (!user?.id) return;
    const uniqueList = Array.from(new Set(list)).filter(id => !!id);
    const allWishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
    allWishlists[user.id] = uniqueList;
    localStorage.setItem('wishlists', JSON.stringify(allWishlists));
    window.dispatchEvent(new Event('wishlistChanged'));
  };

  useEffect(() => {
    setWishlist(getUserWishlist());
    const handleStorage = () => setWishlist(getUserWishlist());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
    // eslint-disable-next-line
  }, [user?.id]);

  const isWished = product ? wishlist.includes(product.id) || wishlist.includes(String(product.id)) : false;

  const handleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    let updatedList;
    let message;
    const currentWishlist = getUserWishlist();
    if (isWished) {
      updatedList = currentWishlist.filter(id => id !== product.id && id !== String(product.id));
      message = 'Removed from wishlist';
    } else {
      updatedList = [...currentWishlist, product.id];
      message = 'Added to wishlist';
    }
    setWishlist(updatedList);
    setUserWishlist(updatedList);
    setToast(message);
    setTimeout(() => setToast(null), 1500);
  };

  useEffect(() => {
    if (!toast) return;
    const toastDiv = document.createElement('div');
    toastDiv.className = 'global-toast-message';
    toastDiv.textContent = toast;
    document.body.appendChild(toastDiv);
    setTimeout(() => {
      toastDiv.classList.add('hide');
    }, 1200);
    setTimeout(() => {
      if (toastDiv.parentNode) document.body.removeChild(toastDiv);
    }, 1500);
    return () => {
      if (toastDiv.parentNode) document.body.removeChild(toastDiv);
    };
  }, [toast]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;


  const otherProducts = (productData.products || [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

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

  // const allTestimonials = [
  //   ...Object.values(userReviews || {}),
  //   ...(product.testimonials || []),
  // ];

  // Calculate discount percent
  const discountPercent = product.offerPrice && product.offerPrice < product.price
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <>
      <SwiperNavStyles />
      <ProductDetailContainer>
        <ProductImageSection>
          <Swiper
            modules={[Thumbs, Navigation]}
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            spaceBetween={10}
            slidesPerView={1}
            style={{ width: '100%', maxWidth: 440, marginBottom: 18 }}
            className="product-detail-swiper"
            onSlideChange={swiper => setActiveImgIdx(swiper.activeIndex)}
            initialSlide={activeImgIdx}
          >
            {(product.images || [product.image]).map((img, idx) => (
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
            slidesPerView={4}
            watchSlidesProgress
            style={{ width: '100%', maxWidth: 440 }}
          >
            {(product.images || [product.image]).map((img, idx) => (
              <SwiperSlide key={idx}>
                <ThumbImage
                  src={
                    img.startsWith('/') || img.startsWith('http')
                      ? img
                      : `${imageBasePath}/${img}`
                  }
                  alt={`thumb-${idx}`}
                  style={{
                    borderColor: idx === activeImgIdx ? '#a084ca' : '#eee',
                    boxShadow: idx === activeImgIdx ? '0 2px 8px #a084ca22' : 'none'
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </ProductImageSection>
        <ProductInfoSection>
          <ProductRatingRow>
            <RatingValue>{product.rating ? product.rating.toFixed(1) : '4.0'}</RatingValue>
            <RatingStar>★</RatingStar>
            <RatingCount>53 Ratings</RatingCount>
          </ProductRatingRow>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductPriceRow>
            {product.offerPrice && product.offerPrice < product.price ? (
              <>
                <OfferPrice>₹{product.offerPrice}</OfferPrice>
                <RegularPrice>₹{product.price}</RegularPrice>
                <DiscountBadge>{discountPercent}% OFF</DiscountBadge>
              </>
            ) : (
              <OfferPrice>₹{product.price}</OfferPrice>
            )}
          </ProductPriceRow>
          
          <QtyRow>
            <QtyLabel>Qty:</QtyLabel>
            <QtyControl>
              <QtyBtn onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</QtyBtn>
              <QtyInput
                type="number"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <QtyBtn onClick={() => setQuantity(quantity + 1)}>+</QtyBtn>
            </QtyControl>
          </QtyRow>
          <ActionRow>
            <AddToCartBtn onClick={handleAddToCart} fullWidth={false}>
              <span style={{ marginRight: 8, fontSize: 18 }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.4673 18.7499C9.40673 18.7499 10.1683 17.9883 10.1683 17.0489C10.1683 16.1095 9.40673 15.3479 8.4673 15.3479C7.52786 15.3479 6.7663 16.1095 6.7663 17.0489C6.7663 17.9883 7.52786 18.7499 8.4673 18.7499Z" stroke="#FFF9F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.8782 18.7499C16.8177 18.7499 17.5792 17.9883 17.5792 17.0489C17.5792 16.1095 16.8177 15.3479 15.8782 15.3479C14.9388 15.3479 14.1772 16.1095 14.1772 17.0489C14.1772 17.9883 14.9388 18.7499 15.8782 18.7499Z" stroke="#FFF9F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.52427 3.555L6.53427 9.919C6.84327 10.897 6.99727 11.386 7.29427 11.748C7.55427 12.068 7.89327 12.315 8.27627 12.468C8.71127 12.641 9.22327 12.641 10.2493 12.641H14.1043C15.1303 12.641 15.6423 12.641 16.0763 12.468C16.4603 12.315 16.7983 12.068 17.0593 11.748C17.3553 11.386 17.5093 10.897 17.8193 9.919L18.2283 8.623L18.4683 7.857L18.7993 6.807C18.9174 6.4325 18.9456 6.03544 18.8817 5.648C18.8178 5.26055 18.6635 4.89361 18.4313 4.57691C18.1991 4.26021 17.8956 4.00266 17.5454 3.82511C17.1951 3.64757 16.808 3.55503 16.4153 3.555H4.52427ZM4.52427 3.555L4.51327 3.518C4.47105 3.37656 4.42436 3.23649 4.37327 3.098C4.17082 2.58554 3.82751 2.14082 3.383 1.81523C2.93849 1.48963 2.41093 1.29645 1.86127 1.258C1.75827 1.25 1.64527 1.25 1.41827 1.25" stroke="#FFF9F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</span>Add to cart
            </AddToCartBtn>
            <BuyNowBtn onClick={handleBuyNow}>
              <span style={{ marginRight: 8, fontSize: 18 }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.4673 18.7499C9.40673 18.7499 10.1683 17.9883 10.1683 17.0489C10.1683 16.1095 9.40673 15.3479 8.4673 15.3479C7.52786 15.3479 6.7663 16.1095 6.7663 17.0489C6.7663 17.9883 7.52786 18.7499 8.4673 18.7499Z" stroke="#FFF9F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.8782 18.7499C16.8177 18.7499 17.5792 17.9883 17.5792 17.0489C17.5792 16.1095 16.8177 15.3479 15.8782 15.3479C14.9388 15.3479 14.1772 16.1095 14.1772 17.0489C14.1772 17.9883 14.9388 18.7499 15.8782 18.7499Z" stroke="#FFF9F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.52427 3.555L6.53427 9.919C6.84327 10.897 6.99727 11.386 7.29427 11.748C7.55427 12.068 7.89327 12.315 8.27627 12.468C8.71127 12.641 9.22327 12.641 10.2493 12.641H14.1043C15.1303 12.641 15.6423 12.641 16.0763 12.468C16.4603 12.315 16.7983 12.068 17.0593 11.748C17.3553 11.386 17.5093 10.897 17.8193 9.919L18.2283 8.623L18.4683 7.857L18.7993 6.807C18.9174 6.4325 18.9456 6.03544 18.8817 5.648C18.8178 5.26055 18.6635 4.89361 18.4313 4.57691C18.1991 4.26021 17.8956 4.00266 17.5454 3.82511C17.1951 3.64757 16.808 3.55503 16.4153 3.555H4.52427ZM4.52427 3.555L4.51327 3.518C4.47105 3.37656 4.42436 3.23649 4.37327 3.098C4.17082 2.58554 3.82751 2.14082 3.383 1.81523C2.93849 1.48963 2.41093 1.29645 1.86127 1.258C1.75827 1.25 1.64527 1.25 1.41827 1.25" stroke="#FFF9F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</span>Buy Now
            </BuyNowBtn>
            <WishlistBtn
              type="button"
              aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
              wished={isWished ? 1 : 0}
              onClick={handleWishlist}
              title={isWished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.50977 17.1304C8.88959 17.4238 9.25799 17.6926 9.62207 17.9048V17.9038C9.92659 18.0823 10.2177 18.2153 10.5 18.2896V18.8013C10.113 18.7186 9.73477 18.5504 9.36914 18.3364C8.97905 18.1081 8.58844 17.8225 8.2002 17.5229L8.50977 17.1304ZM13.7988 17.5229C13.5407 17.7222 13.2819 17.9154 13.0225 18.0894L12.6309 18.3364C12.2648 18.55 11.8867 18.7174 11.5 18.8003V18.2896C11.7824 18.215 12.0737 18.0821 12.3779 17.9048C12.7418 17.6927 13.1097 17.4236 13.4893 17.1304L13.7988 17.5229ZM1.26562 7.74463C1.39236 9.85714 2.3168 11.5139 3.56348 12.9194L3.56445 12.9204C4.79967 14.3105 6.33266 15.4395 7.7207 16.5161L7.41113 16.9087C6.0394 15.8454 4.45843 14.6791 3.19043 13.2515C1.8839 11.7817 0.892508 10.0121 0.764648 7.74463H1.26562ZM21.2354 7.74463C21.1075 10.0119 20.1162 11.7806 18.8096 13.2515L18.8086 13.2524C17.5405 14.6809 15.96 15.8446 14.5879 16.9087L14.2783 16.5161C15.6665 15.4394 17.2002 14.3107 18.4355 12.9204L18.4365 12.9194C19.6832 11.5139 20.6076 9.85714 20.7344 7.74463H21.2354ZM11.749 2.59033C13.8133 0.96311 16.0154 0.810443 17.792 1.62256C19.6859 2.48872 21.056 4.43601 21.2305 6.74463H20.7285C20.5671 4.76889 19.4605 3.09959 17.9238 2.24854L17.584 2.07764C16.0089 1.35753 14.0184 1.45756 12.0996 2.94971L11.9004 2.74268C11.8505 2.69081 11.7993 2.64056 11.749 2.59033ZM4.20801 1.62256C5.98401 0.810705 8.18637 0.963294 10.249 2.58936C10.1992 2.63914 10.1491 2.68933 10.0996 2.74072L9.89844 2.94873C8.11939 1.56561 6.27934 1.37873 4.76562 1.93311L4.41602 2.07764C2.70482 2.86058 1.44464 4.62696 1.27148 6.74463H0.769531C0.938246 4.51346 2.22437 2.61979 4.01953 1.71338L4.20801 1.62256Z" fill="#5A4E4D" stroke="#E5A6A6"/>
                </svg>

            </WishlistBtn>
          </ActionRow>
        </ProductInfoSection>
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
            Offer valid for <BannerHighlight>today only!</BannerHighlight>
          </>
        }
        buttonText="Buy Now"
        buttonTo="/products"
      />
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

      <RelatedSection className="container">
        <RelatedTitle>Other Products</RelatedTitle>
        <ProductGrid products={otherProducts} />
      </RelatedSection>
    </>
  );
};

const ProductDetailContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: ${pxToRem(40)};
  max-width: ${pxToRem(1320)};
  margin: ${pxToRem(32)} auto ${pxToRem(32)} auto;
  padding: ${pxToRem(0)} ${pxToRem(20)};
  @media (max-width: 1100px) {
    flex-direction: column;
    gap: ${pxToRem(32)};
    max-width: 98vw;
    padding: ${pxToRem(18)} ${pxToRem(6)};
    border-radius: ${pxToRem(12)};
  }
`;

const ProductImageSection = styled.div`
  width: 50%;
  //background: #fff;
  border-radius: 10px;
  //padding: 32px 24px 18px 24px;
  //box-shadow: 0 2px 16px rgba(168,132,202,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  .swiper{
    width: 100%;
    max-width: 100% !important;
  }
  @media (max-width: 900px) {
    width: 100%;
    max-width: 100%;
    padding: 18px 8px 8px 8px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  max-height: ${pxToRem(480)};
  object-fit: contain;
  border-radius: ${pxToRem(12)};
  background: #f9f9f9;
  margin-bottom: 0;
  border: ${pxToRem(1.5)} solid #ede7f6;
`;


const ThumbImage = styled.img`
  width: ${pxToRem(140)};
  height: ${pxToRem(140)};
  object-fit: contain;
  border-radius: ${pxToRem(22)};
  border: ${pxToRem(2.5)} solid #eee;
  background: #fff;
  cursor: pointer;
  margin: 0 ${pxToRem(4)};
  box-shadow: 0 ${pxToRem(2)} ${pxToRem(12)} rgba(63,136,197,0.10);
  transition: border 0.18s, box-shadow 0.18s;
  &:hover {
    border: ${pxToRem(2.5)} solid ${colors.primary};
    box-shadow: 0 ${pxToRem(4)} ${pxToRem(18)} rgba(215,38,96,0.13);
  }
`;

const ProductInfoSection = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  max-width: 100%;
  @media (max-width: 900px) {
    width: 100%;
    max-width: 100%;
  }
`;

const ProductTitle = styled.h1`
  font-size: ${fontSizes.xl};
  font-family: ${fonts.title};
  font-weight: 800;
  color: ${colors.text};
  margin: 0 0 8px 0;
  letter-spacing: -1px;
`;

const ProductCategory = styled.div`
  color: ${colors.secondary};
  font-size: ${fontSizes.base};
  font-family: ${fonts.body};
  font-weight: 600;
  margin-bottom: ${pxToRem(8)};
  text-transform: capitalize;
`;

const ProductRatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${pxToRem(0)};
  padding: ${pxToRem(2)} ${pxToRem(5)};
  margin-bottom: ${pxToRem(8)};
  width:${pxToRem(125)};
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: ${pxToRem(6)};
  background: ${colors.gray};
  border: ${pxToRem(1)} solid ${colors.dark};
`;

const RatingValue = styled.span`
  color: ${colors.dark};
  font-size: ${fontSizes.sm};
  font-weight: 600;
  margin-right: ${pxToRem(4)};
`;

const RatingStar = styled.span`
  color: #ffc107;
  font-size: ${fontSizes.sm};
`;

const RatingCount = styled.span`
  color: ${colors.dark};
  font-size: ${fontSizes.sm};
  font-weight: 600;
  margin-left: ${pxToRem(8)};
`;

const ProductPriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: ${pxToRem(8)};
`;

const OfferPrice = styled.span`
  color: ${colors.text};
  font-size: ${fontSizes.xl};
  font-weight: 900;
`;

const RegularPrice = styled.span`
  color: #bdbdbd;
  text-decoration: line-through;
  font-size: ${fontSizes.md};
  font-weight: 500;
`;

const DiscountBadge = styled.span`
  background: #f7d7d7;
  color: ${colors.primary};
  font-weight: 700;
  font-size: ${fontSizes.base};
  border-radius: ${pxToRem(6)};
  padding: ${pxToRem(4)} ${pxToRem(12)};
  margin-left: ${pxToRem(4)};
`;

const ProductDesc = styled.p`
  color: #444;
  font-size: ${fontSizes.base};
  font-family: ${fonts.body};
  margin-bottom: ${pxToRem(10)};
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${pxToRem(16)};
  margin: ${pxToRem(18)} 0 ${pxToRem(18)} 0;
`;

const QtyLabel = styled.span`
  font-size: 1.1rem;
  color: #5b4a44;
  font-weight: 600;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  background: #f6f3fa;
  border-radius: ${pxToRem(30)};
  border: ${pxToRem(1.5)} solid #ede7f6;
  overflow: hidden;
`;

const QtyBtn = styled.button`
  width: ${pxToRem(38)};
  height: ${pxToRem(38)};
  background: none;
  border: none;
  color: #a084ca;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #ede7f6;
  }
`;

const QtyInput = styled.input`
  width: ${pxToRem(44)};
  height: ${pxToRem(38)};
  text-align: center;
  border: none;
  background: none;
  font-size: 1.1rem;
  color: #5b4a44;
  font-weight: 600;
  outline: none;
`;

const ActionRow = styled.div`
  display: flex;
  gap: ${pxToRem(14)};
  margin: ${pxToRem(18)} 0 0 0;
`;

const AddToCartBtn = styled(Button)`
  flex: 1;
  background: #ede7f6;
  color: #a084ca;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: ${pxToRem(6)};
  border: none;
  &:hover {
    background: #a084ca;
    color: #fff;
  }
`;

const BuyNowBtn = styled(Button)`
  flex: 1;
  background: #5b4a44;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: ${pxToRem(6)};
  border: none;
  &:hover {
    background: #a084ca;
    color: #fff;
  }
`;

const WishlistBtn = styled.button`
  background: #fff;
  border: ${pxToRem(1.5)} solid #e5a6a6;
  border-radius: ${pxToRem(8)};
  color: ${({ wished }) => (wished ? '#e74c3c' : '#a084ca')};
  font-size: ${pxToRem(22)};
  width: ${pxToRem(50)};
  height: ${pxToRem(50)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.18s, border 0.18s, background 0.18s;
  &:hover {
    color: #e74c3c;
    border-color: #e74c3c;
    background: #fff7f5;
  }
`;

const CustomTestimonialSection = styled.section`
  display: flex;
  overflow: hidden;
  border-radius: ${pxToRem(10)};
  margin: ${pxToRem(40)} auto 0 auto;
  overflow: hidden;
  min-height: ${pxToRem(340)};
  max-width: 1320px;
  width: 100%;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 0;
  }
`;

const TestimonialLeft = styled.div`
  width: 50%;
  background: linear-gradient(120deg, #fbeaec 0%, #f8f3fa 100%);
  padding: 48px 38px 38px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px 0 0 10px;
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
  font-family: ${fonts.title};
  font-weight: 700;
  color: #222;
  margin-bottom: ${pxToRem(18)};
`;

const TestimonialText = styled.div`
  font-size: ${pxToRem(17)};
  font-family: ${fonts.body};
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



const TestimonialRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 38px 28px;
  background: #fff;
  border-radius: 0 10px 10px 0;
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

const ButtonRow = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 10px;
`;

const BuyNowButton = styled(Button)`
  background: #27ae60;
  color: #fff;
  &:hover {
    background: #219150;
    color: #fff;
  }
`;

const WishlistButton = styled.button`
  background: #fff;
  border: 1.5px solid #eee;
  border-radius: 8px;
  color: ${({ wished }) => (wished ? '#e74c3c' : '#888')};
  font-size: 22px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.18s, border 0.18s, background 0.18s;
  &:hover {
    color: #e74c3c;
    border-color: #e74c3c;
    background: #fff7f5;
  }
`;

// Add global styles for the toast if not already present
if (typeof document !== 'undefined' && !document.getElementById('global-toast-style')) {
  const style = document.createElement('style');
  style.id = 'global-toast-style';
  style.innerHTML = `
    .global-toast-message {
      position: fixed;
      top: 300px;
      right: 0;
      transform: translateX(110%);
      background: #222;
      color: #fff;
      padding: 10px 22px;
      border-radius: 6px 0 0 6px;
      font-size: 14px;
      z-index: 2000;
      box-shadow: 0 2px 12px rgba(0,0,0,0.12);
      animation: slideInRight 1.5s forwards;
      pointer-events: none;
    }
    .global-toast-message.hide {
      animation: slideOutRight 0.3s forwards;
    }
    @keyframes slideInRight {
      0% {
        opacity: 0;
        transform: translateX(110%);
      }
      10% {
        opacity: 1;
        transform: translateX(0%);
      }
      90% {
        opacity: 1;
        transform: translateX(0%);
      }
      100% {
        opacity: 1;
        transform: translateX(0%);
      }
    }
    @keyframes slideOutRight {
      0% {
        opacity: 1;
        transform: translateX(0%);
      }
      100% {
        opacity: 0;
        transform: translateX(110%);
      }
    }
  `;
  document.head.appendChild(style);
}

export default ProductDetail;