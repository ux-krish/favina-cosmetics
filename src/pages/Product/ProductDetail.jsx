// Custom styled wrapper for Share button using Button.jsx
import styled, { createGlobalStyle } from 'styled-components';

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { addToCart, toggleCart } from '../../redux/slices/cartSlice';
import Button from '../../components/common/Button';
import productData from '../../data/product.json';
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
import bgTestimonial from '../../assets/images/pawel-czerwinski-fcZU7mRWImY-unsplash1.png';
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
  const [isInCart, setIsInCart] = useState(false);

  // Sync quantity with cart sidebar changes
  useEffect(() => {
    if (!product || !user?.id) return;
    const syncQuantity = () => {
      const allCarts = JSON.parse(localStorage.getItem('carts') || '{}');
      const arr = Array.isArray(allCarts[user.id]) ? allCarts[user.id] : [];
      const cartItem = arr.find(item => item.id === product.id);
      if (cartItem && cartItem.quantity !== quantity) {
        setQuantity(cartItem.quantity);
      }
    };
    window.addEventListener('cartChanged', syncQuantity);
    return () => window.removeEventListener('cartChanged', syncQuantity);
  }, [product, user?.id, quantity]);


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
      setQuantity(exists.quantity);
      updatedCart = userCart;
      dispatch(toggleCart()); // Open cart sidebar
      // No need to add again, just open sidebar
      return;
    } else {
      updatedCart = [...userCart, { ...product, quantity }];
      if (isAuthenticated) {
        setUserCart(updatedCart);
      }
      dispatch(addToCart({ ...product, quantity }));
      dispatch(toggleCart()); // Open cart sidebar
      setIsInCart(true);
      // Fire cartChanged event for listeners
      window.dispatchEvent(new Event('cartChanged'));
    }
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

  useEffect(() => {
    if (!product || !user?.id) return;
    const userCart = getUserCart();
    setIsInCart(userCart.some(item => String(item.id) === String(product.id)));
    // Listen for cart changes
    const syncCartStatus = () => {
      const updatedCart = getUserCart();
      setIsInCart(updatedCart.some(item => String(item.id) === String(product.id)));
    };
    window.addEventListener('cartChanged', syncCartStatus);
    return () => window.removeEventListener('cartChanged', syncCartStatus);
  }, [product, user?.id]);

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

  // --- Share Button handler ---
  const handleShare = () => {
    if (!product) return;
    const shareUrl = window.location.href;
    const shareText = `Check out this product: ${product.title}`;
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback: WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
      window.open(whatsappUrl, '_blank');
    }
  };
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
            <ProductRatingBox>
              <RatingValue>{product.rating ? product.rating.toFixed(1) : '4.0'}</RatingValue>
              <RatingStar>★</RatingStar>
              <RatingCount>53 Ratings</RatingCount>
              </ProductRatingBox>
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
              <QtyBtn onClick={() => setQuantity(Math.max(1, quantity - 1))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 12H19" stroke="#4E4E4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
</QtyBtn>
              <QtyInput
                type="tel"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <QtyBtn onClick={() => setQuantity(quantity + 1)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5V19M5 12H19" stroke="#4E4E4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
</QtyBtn>
            </QtyControl>
          </QtyRow>
          <ActionRow>
            <AddToCartBtn
              onClick={isInCart ? () => dispatch(toggleCart()) : handleAddToCart}
              fullWidth={false}
            >
              <span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.4673 18.7499C9.40673 18.7499 10.1683 17.9883 10.1683 17.0489C10.1683 16.1095 9.40673 15.3479 8.4673 15.3479C7.52786 15.3479 6.7663 16.1095 6.7663 17.0489C6.7663 17.9883 7.52786 18.7499 8.4673 18.7499Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.8782 18.7499C16.8177 18.7499 17.5792 17.9883 17.5792 17.0489C17.5792 16.1095 16.8177 15.3479 15.8782 15.3479C14.9388 15.3479 14.1772 16.1095 14.1772 17.0489C14.1772 17.9883 14.9388 18.7499 15.8782 18.7499Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.52427 3.555L6.53427 9.919C6.84327 10.897 6.99727 11.386 7.29427 11.748C7.55427 12.068 7.89327 12.315 8.27627 12.468C8.71127 12.641 9.22327 12.641 10.2493 12.641H14.1043C15.1303 12.641 15.6423 12.641 16.0763 12.468C16.4603 12.315 16.7983 12.068 17.0593 11.748C17.3553 11.386 17.5093 10.897 17.8193 9.919L18.2283 8.623L18.4683 7.857L18.7993 6.807C18.9174 6.4325 18.9456 6.03544 18.8817 5.648C18.8178 5.26055 18.6635 4.89361 18.4313 4.57691C18.1991 4.26021 17.8956 4.00266 17.5454 3.82511C17.1951 3.64757 16.808 3.55503 16.4153 3.555H4.52427ZM4.52427 3.555L4.51327 3.518C4.47105 3.37656 4.42436 3.23649 4.37327 3.098C4.17082 2.58554 3.82751 2.14082 3.383 1.81523C2.93849 1.48963 2.41093 1.29645 1.86127 1.258C1.75827 1.25 1.64527 1.25 1.41827 1.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {isInCart ? 'View Cart' : 'Add to cart'}
            </AddToCartBtn>
            <BuyNowBtn onClick={handleBuyNow}>
              <span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.4673 18.7499C9.40673 18.7499 10.1683 17.9883 10.1683 17.0489C10.1683 16.1095 9.40673 15.3479 8.4673 15.3479C7.52786 15.3479 6.7663 16.1095 6.7663 17.0489C6.7663 17.9883 7.52786 18.7499 8.4673 18.7499Z" stroke="#FFF9F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15.8782 18.7499C16.8177 18.7499 17.5792 17.9883 17.5792 17.0489C17.5792 16.1095 16.8177 15.3479 15.8782 15.3479C14.9388 15.3479 14.1772 16.1095 14.1772 17.0489C14.1772 17.9883 14.9388 18.7499 15.8782 18.7499Z" stroke="#FFF9F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M4.52427 3.555L6.53427 9.919C6.84327 10.897 6.99727 11.386 7.29427 11.748C7.55427 12.068 7.89327 12.315 8.27627 12.468C8.71127 12.641 9.22327 12.641 10.2493 12.641H14.1043C15.1303 12.641 15.6423 12.641 16.0763 12.468C16.4603 12.315 16.7983 12.068 17.0593 11.748C17.3553 11.386 17.5093 10.897 17.8193 9.919L18.2283 8.623L18.4683 7.857L18.7993 6.807C18.9174 6.4325 18.9456 6.03544 18.8817 5.648C18.8178 5.26055 18.6635 4.89361 18.4313 4.57691C18.1991 4.26021 17.8956 4.00266 17.5454 3.82511C17.1951 3.64757 16.808 3.55503 16.4153 3.555H4.52427ZM4.52427 3.555L4.51327 3.518C4.47105 3.37656 4.42436 3.23649 4.37327 3.098C4.17082 2.58554 3.82751 2.14082 3.383 1.81523C2.93849 1.48963 2.41093 1.29645 1.86127 1.258C1.75827 1.25 1.64527 1.25 1.41827 1.25" stroke="#FFF9F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
</span>Buy Now
            </BuyNowBtn>
            <WishlistBtn
              type="button"
              aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
              $wished={isWished ? 1 : 0}
              onClick={handleWishlist}
              title={isWished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FaHeart />

            </WishlistBtn>
          </ActionRow>
          <CheckoutCardInfo>
            <CheckoutCardInfoTitle>Secured and trusted checkout with:</CheckoutCardInfoTitle>
            <svg width="177" height="25" viewBox="0 0 177 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* ...svg paths... */}
            </svg>

          </CheckoutCardInfo>
          <Button
            onClick={handleShare}
            small
            style={{
              width: 120,
              minWidth: 120,
              padding: '8px 0',
              borderRadius: 24,
              gap: 6,
              marginTop: 12,
              background: colors.primary,
              color: colors.textLight,
              fontWeight: 500,
              fontSize: fontSizes.base,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            }}
            title="Share this product"
          >
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }}>
              <path d="M17.5 13.5V17.5C17.5 18.0523 17.0523 18.5 16.5 18.5H5.5C4.94772 18.5 4.5 18.0523 4.5 17.5V13.5" stroke="#a084ca" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 14V4.5M11 4.5L7.5 8M11 4.5L14.5 8" stroke="#a084ca" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Share
          </Button>
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
      <CustomTestimonialSection>
        <TestimonialContainer>
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
                        <VerifiedIcon>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.56252 1.03957C9.76494 0.993048 9.97682 1.01071 10.1687 1.09009C10.3607 1.16948 10.5231 1.30665 10.6335 1.48257L11.6275 3.06957C11.7077 3.19739 11.8157 3.30542 11.9435 3.38557L13.5305 4.37957C13.7068 4.4899 13.8443 4.65245 13.9239 4.84459C14.0035 5.03673 14.0212 5.2489 13.9745 5.45157L13.5545 7.27557C13.5206 7.42298 13.5206 7.57616 13.5545 7.72357L13.9745 9.54857C14.0207 9.75095 14.0028 9.96268 13.9232 10.1544C13.8437 10.3461 13.7064 10.5084 13.5305 10.6186L11.9435 11.6136C11.8157 11.6937 11.7077 11.8017 11.6275 11.9296L10.6335 13.5166C10.5233 13.6927 10.3609 13.8301 10.1689 13.9096C9.977 13.9892 9.76504 14.007 9.56252 13.9606L7.73752 13.5406C7.59043 13.5068 7.43761 13.5068 7.29052 13.5406L5.46552 13.9606C5.263 14.007 5.05104 13.9892 4.85911 13.9096C4.66717 13.8301 4.50479 13.6927 4.39452 13.5166L3.40052 11.9296C3.32009 11.8016 3.21171 11.6936 3.08352 11.6136L1.49752 10.6196C1.32142 10.5093 1.18404 10.3469 1.10447 10.155C1.0249 9.96305 1.00709 9.75109 1.05352 9.54857L1.47252 7.72357C1.5064 7.57616 1.5064 7.42298 1.47252 7.27557L1.05252 5.45157C1.00596 5.2488 1.02381 5.03655 1.10358 4.8444C1.18334 4.65225 1.32105 4.48976 1.49752 4.37957L3.08352 3.38557C3.21171 3.30554 3.32009 3.1975 3.40052 3.06957L4.39452 1.48257C4.50487 1.30684 4.66715 1.16979 4.85887 1.09042C5.05059 1.01104 5.26225 0.993272 5.46452 1.03957L7.29052 1.45857C7.43761 1.4923 7.59043 1.4923 7.73752 1.45857L9.56252 1.03957Z" fill="#F6C6A7" stroke="#5A4E4D"/>
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
      </CustomTestimonialSection>

      <RelatedSection>
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
  max-width: ${pxToRem(1100)};
  margin: ${pxToRem(32)} auto ${pxToRem(32)} auto;
  padding: ${pxToRem(0)} ${pxToRem(20)};
  position: relative;
  @media (max-width: 1100px) {
    flex-direction: column;
    gap: ${pxToRem(32)};
    max-width: 100%;
    padding: ${pxToRem(18)} ${pxToRem(20)};
    border-radius: ${pxToRem(12)};
    margin: ${pxToRem(0)} auto 0;
  }
`;

const ProductImageSection = styled.div`
  width: 50%;
  background: #f9f9f9;
  border-radius: 10px;
  //padding: 32px 24px 18px 24px;
  //box-shadow: 0 2px 16px rgba(168,132,202,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  border: ${pxToRem(1.5)} solid #ede7f6;
  padding:${pxToRem(24)} ${pxToRem(20)} ${pxToRem(20)} ${pxToRem(16)};
  .swiper-slide{
      background: #fff;
      overflow: hidden;
      border-radius: ${pxToRem(6)};
    }
  .swiper{
    width: 100%;
    max-width: 100% !important;
    &:not(.swiper + .swiper){
      margin-bottom: ${pxToRem(10)} !important;
    }
  }
    .swiper-thumbs{
      .swiper-slide{
      border-radius: ${pxToRem(6)};
      background: transparent;}
    }
  @media (max-width: 1099px) {
    width: 100%;
    max-width: 100%;
    padding: 10px 8px 10px 8px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  object-fit: contain;
  margin-bottom: 0;
  aspect-ratio: 1 / 1;
`;


const ThumbImage = styled.img`
display: block;
  width: 100%;
  height:auto;
  object-fit: contain;
  border-radius: ${pxToRem(6)};
  //border: ${pxToRem(2.5)} solid #eee;
  background: #fff;
  cursor: pointer;
  //margin: 0 ${pxToRem(4)};
  box-shadow: 0 ${pxToRem(2)} ${pxToRem(12)} rgba(63,136,197,0.10);
  transition: border 0.18s, box-shadow 0.18s;
  &:hover {
    border: ${pxToRem(2.5)} solid ${colors.primary};
    //box-shadow: 0 ${pxToRem(4)} ${pxToRem(18)} rgba(215,38,96,0.13);
  }
`;

const ProductInfoSection = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(10)};
  padding: ${pxToRem(12)} ${pxToRem(0)} ${pxToRem(12)} ${pxToRem(0)};
  min-width: 0;
  max-width: 100%;
  @media (max-width: 1099px) {
    width: 100%;
    max-width: 100%;
  }
    @media (max-width: 540px) {

    gap: ${pxToRem(2)};
  }
`;

const ProductTitle = styled.h1`
  font-size: ${fontSizes.xl};
  font-family: ${fonts.title};
  font-weight: 800;
  line-height: 1.2;
  color: ${colors.text};
  margin: 0 0 8px 0;
  @media (max-width: 540px) {
    font-size: ${fontSizes.lg};
    font-weight: 600;
    letter-spacing: -0.5px;
  }
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
  margin-bottom: ${pxToRem(8)};
  
  text-align: center;
  
`;


const CheckoutCardInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: ${pxToRem(12)} ${pxToRem(0)};
  gap: ${pxToRem(8)};
  margin-top: ${pxToRem(8)};
  `;

  const CheckoutCardInfoTitle = styled.div`
  font-size: ${fontSizes.xs};   
  `;

const ProductRatingBox = styled.div`
  flex:0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${pxToRem(1)} ${pxToRem(8)};
  border-radius: ${pxToRem(6)};
  background: ${colors.textLight};
  border: ${pxToRem(1)} solid ${colors.highlight};
  @media (max-width: 540px) {
    margin-bottom: ${pxToRem(8)};
  }
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
  font-weight: 700;
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


const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${pxToRem(16)};
  margin: ${pxToRem(5)} 0 ${pxToRem(5)} 0;
`;

const QtyLabel = styled.span`
  font-size: 1.1rem;
  color: #5b4a44;
  font-weight: 600;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${pxToRem(8)};
`;

const QtyBtn = styled.button`
  width: ${pxToRem(38)};
  height: ${pxToRem(38)};
  border-radius: ${pxToRem(30)};
  background: none;
  border: none;
  cursor: pointer;
  background: ${colors.info};
  border: ${pxToRem(1.5)} solid #ede7f6;
  transition: background 0.15s;
  display: flex;
  align-items: center;  
  justify-content: center;
  svg{
    width: ${pxToRem(18)};
    height: ${pxToRem(18)};
  }
  &:hover {
    background: #ede7f6;
  }
`;

const QtyInput = styled.input`
  max-width: ${pxToRem(38)};
  height: ${pxToRem(38)};
  border-radius: ${pxToRem(30)};
   border: ${pxToRem(1.5)} solid #ede7f6;
  background: #fff;
  text-align: center;
  font-size: ${fontSizes.sm};
  color: #5b4a44;
  font-weight: 600;
  outline: none;
  text-align: center;
`;

const ActionRow = styled.div`
  display: flex;
  gap: ${pxToRem(14)};
  margin: ${pxToRem(18)} 0 0 0;
  justify-content: flex-start;
`;

const AddToCartBtn = styled(Button)`
  flex: 1;
  background: ${colors.secondary};
  color: ${colors.textLight};
  font-weight: 700;
  font-size: ${fontSizes.base};
  border-radius: ${pxToRem(6)};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${pxToRem(8)};
  &:hover:not(:disabled) {
    background: #a084ca;
    color: #fff;
  }
`;

const BuyNowBtn = styled(Button)`
  flex: 1;
  background: ${colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: ${fontSizes.base};
  border-radius: ${pxToRem(6)};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${pxToRem(8)};
  &:hover:not(:disabled) {
    background: #a084ca;
    color: #fff;
  }
`;

const WishlistBtn = styled.button`
  background: #fff;
border: ${pxToRem(1)} solid ${({ $wished }) => ($wished ? colors.warning : '#d3d3d3')};
  border-radius: ${pxToRem(8)};
  color: ${({ $wished }) => ($wished ? `${colors.warning}` : '#d3d3d3')};
  font-size: ${pxToRem(22)};
  width: ${pxToRem(50)};
  height: ${pxToRem(50)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.18s, border 0.18s, background 0.18s;
  &:hover {
    color: ${colors.warning};
    border-color: ${colors.warning};
    background: #fff;
  }
    @media (max-width: 1099px) {
      position: absolute;
      top: ${pxToRem(40)};
      right: ${pxToRem(30)};
      z-index: 10;
    }
`;

const CustomTestimonialSection = styled.section`
  overflow: hidden;
  margin: ${pxToRem(40)} auto 0 auto;
  overflow: hidden;
  min-height: ${pxToRem(340)};
  width: 100%;
   // max-width: 1320px;
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


const TestimonialLeft = styled.div`
  width: 50%;
  background:  #fbeaec url(${bgTestimonial}) no-repeat center center;
  background-size: cover;
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

const RatingBox = styled.div`
  display: inline-flex;
  align-items: center;
  background: #fff;
  color: ${colors.text};
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
  padding:0 20px 40px;
`;

const RelatedTitle = styled.h3`
  font-size: ${fontSizes.xl};
  color: ${colors.text};
  font-weight: 800;
  margin-bottom: 24px;
  text-align: center;
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
      background: ${colors.text};
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



const ShareButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${colors.primary};
  color: ${colors.textLight};
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  font-size: ${fontSizes.base};
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s;
  margin-top: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  &:hover {
    background: ${colors.accent};
    color: #fff;
  }
`;