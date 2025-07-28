import { createGlobalStyle , styled} from 'styled-components';
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
            <AddToCartBtn onClick={handleAddToCart} fullWidth={false}>
              <span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.4673 18.7499C9.40673 18.7499 10.1683 17.9883 10.1683 17.0489C10.1683 16.1095 9.40673 15.3479 8.4673 15.3479C7.52786 15.3479 6.7663 16.1095 6.7663 17.0489C6.7663 17.9883 7.52786 18.7499 8.4673 18.7499Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15.8782 18.7499C16.8177 18.7499 17.5792 17.9883 17.5792 17.0489C17.5792 16.1095 16.8177 15.3479 15.8782 15.3479C14.9388 15.3479 14.1772 16.1095 14.1772 17.0489C14.1772 17.9883 14.9388 18.7499 15.8782 18.7499Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M4.52427 3.555L6.53427 9.919C6.84327 10.897 6.99727 11.386 7.29427 11.748C7.55427 12.068 7.89327 12.315 8.27627 12.468C8.71127 12.641 9.22327 12.641 10.2493 12.641H14.1043C15.1303 12.641 15.6423 12.641 16.0763 12.468C16.4603 12.315 16.7983 12.068 17.0593 11.748C17.3553 11.386 17.5093 10.897 17.8193 9.919L18.2283 8.623L18.4683 7.857L18.7993 6.807C18.9174 6.4325 18.9456 6.03544 18.8817 5.648C18.8178 5.26055 18.6635 4.89361 18.4313 4.57691C18.1991 4.26021 17.8956 4.00266 17.5454 3.82511C17.1951 3.64757 16.808 3.55503 16.4153 3.555H4.52427ZM4.52427 3.555L4.51327 3.518C4.47105 3.37656 4.42436 3.23649 4.37327 3.098C4.17082 2.58554 3.82751 2.14082 3.383 1.81523C2.93849 1.48963 2.41093 1.29645 1.86127 1.258C1.75827 1.25 1.64527 1.25 1.41827 1.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
</span>Add to cart
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
<path d="M14.4 17.1877H16.8V14.0627H20.8C21.2533 14.0627 21.6336 13.9127 21.9408 13.6127C22.248 13.3127 22.4011 12.9419 22.4 12.5002V9.37524C22.4 8.93253 22.2464 8.5617 21.9392 8.26274C21.632 7.96378 21.2523 7.81378 20.8 7.81274H14.4V17.1877ZM24 17.1877H26.4V7.81274H24V17.1877ZM16.8 11.719V10.1565H20V11.719H16.8ZM6.4 17.1877H11.2C11.6533 17.1877 12.0336 17.0377 12.3408 16.7377C12.648 16.4377 12.8011 16.0669 12.8 15.6252V7.81274H10.4V14.844H7.2V7.81274H4.8V15.6252C4.8 16.0679 4.9536 16.4393 5.2608 16.7393C5.568 17.0393 5.94773 17.1888 6.4 17.1877ZM3.2 25.0002C2.32 25.0002 1.56693 24.6945 0.9408 24.0831C0.314667 23.4716 0.00106667 22.7357 0 21.8752V3.12524C0 2.26587 0.3136 1.53045 0.9408 0.918994C1.568 0.307535 2.32107 0.00128581 3.2 0.000244141H28.8C29.68 0.000244141 30.4336 0.306494 31.0608 0.918994C31.688 1.53149 32.0011 2.26691 32 3.12524V21.8752C32 22.7346 31.6869 23.4706 31.0608 24.0831C30.4347 24.6956 29.6811 25.0013 28.8 25.0002H3.2Z" fill="#5A4E4D"/>
<path d="M74.6665 21.0539C74.6665 21.4336 74.4036 21.7068 74.0251 21.7068C73.6353 21.7068 73.3837 21.4165 73.3837 21.0539C73.3837 20.6913 73.6353 20.401 74.0251 20.401C74.4036 20.401 74.6665 20.6913 74.6665 21.0539ZM56.8605 20.401C56.4532 20.401 56.2191 20.6913 56.2191 21.0539C56.2191 21.4165 56.4542 21.7068 56.8605 21.7068C57.2328 21.7068 57.4844 21.4336 57.4844 21.0539C57.4782 20.6913 57.2328 20.401 56.8605 20.401ZM63.5923 20.3849C63.2829 20.3849 63.0932 20.5798 63.0478 20.8701H64.1419C64.0904 20.5517 63.8903 20.3849 63.5923 20.3849ZM69.7683 20.401C69.3785 20.401 69.1444 20.6913 69.1444 21.0539C69.1444 21.4165 69.3795 21.7068 69.7683 21.7068C70.1581 21.7068 70.4097 21.4336 70.4097 21.0539C70.4097 20.6913 70.157 20.401 69.7683 20.401ZM75.8349 21.8574C75.8349 21.8745 75.8524 21.8855 75.8524 21.9187C75.8524 21.9358 75.8349 21.9468 75.8349 21.98C75.8174 21.997 75.8174 22.0081 75.806 22.0241C75.7885 22.0412 75.7772 22.0523 75.7431 22.0523C75.7256 22.0693 75.7143 22.0693 75.6802 22.0693C75.6627 22.0693 75.6514 22.0693 75.6173 22.0523C75.5998 22.0523 75.5884 22.0352 75.572 22.0241C75.5544 22.0071 75.5431 21.996 75.5431 21.98C75.5255 21.9518 75.5255 21.9358 75.5255 21.9187C75.5255 21.8906 75.5255 21.8745 75.5431 21.8574C75.5431 21.8293 75.5606 21.8132 75.572 21.7961C75.5895 21.7791 75.6008 21.7791 75.6173 21.768C75.6462 21.7509 75.6627 21.7509 75.6802 21.7509C75.7091 21.7509 75.7256 21.7509 75.7431 21.768C75.772 21.7841 75.7885 21.7841 75.806 21.7961C75.8236 21.8082 75.8174 21.8293 75.8349 21.8574ZM75.7091 21.9358C75.738 21.9358 75.738 21.9187 75.7545 21.9187C75.772 21.9016 75.772 21.8906 75.772 21.8745C75.772 21.8584 75.772 21.8464 75.7545 21.8303C75.738 21.8303 75.7256 21.8132 75.6916 21.8132H75.5998V22.0081H75.6452V21.9297H75.6627L75.7256 22.0081H75.771L75.7091 21.9358ZM80 2.67903V22.3215C79.9992 23.0317 79.7092 23.7126 79.1936 24.2148C78.678 24.717 77.9789 24.9994 77.2497 25.0002H49.7503C49.0211 24.9994 48.322 24.717 47.8064 24.2148C47.2908 23.7126 47.0008 23.0317 47 22.3215V2.67903C47.0008 1.96882 47.2908 1.28792 47.8064 0.785723C48.322 0.283526 49.0211 0.00104169 49.7503 0.000244141H77.2497C77.9789 0.00104169 78.678 0.283526 79.1936 0.785723C79.7092 1.28792 79.9992 1.96882 80 2.67903ZM50.668 10.4683C50.668 14.7371 54.2257 18.1963 58.6022 18.1963C60.1609 18.1922 61.6843 17.7443 62.9849 16.9076C58.8085 13.5991 58.8373 7.3546 62.9849 4.04504C61.6856 3.20571 60.1613 2.75752 58.6022 2.75637C54.2257 2.75135 50.668 6.21559 50.668 10.4683ZM63.5005 16.54C67.5398 13.4705 67.5223 7.4892 63.5005 4.40362C59.4788 7.4892 59.4612 13.4765 63.5005 16.54ZM55.3477 20.7978C55.3477 20.3126 55.0208 19.9942 54.5052 19.9771C54.2412 19.9771 53.9607 20.0555 53.772 20.3397C53.6349 20.1107 53.3997 19.9771 53.0728 19.9771C52.954 19.9748 52.8363 20.001 52.7303 20.0536C52.6244 20.1061 52.5334 20.1834 52.4655 20.2785V20.0334H51.9963V22.0814H52.4655C52.4655 21.0268 52.3221 20.396 52.9811 20.396C53.5658 20.396 53.4513 20.9655 53.4513 22.0814H53.904C53.904 21.0599 53.7607 20.396 54.4196 20.396C55.0043 20.396 54.8888 20.9544 54.8888 22.0814H55.3591V20.7978H55.3477ZM57.9206 20.0334H57.4679V20.2785C57.3879 20.181 57.2856 20.103 57.1693 20.0507C57.0529 19.9984 56.9257 19.9732 56.7976 19.9771C56.2077 19.9771 55.755 20.4352 55.755 21.0539C55.755 21.6786 56.2077 22.1306 56.7976 22.1306C57.0956 22.1306 57.3132 22.0241 57.4679 21.8293V22.0864H57.9206V20.0334ZM60.2408 21.4617C60.2408 20.625 58.9291 21.0037 58.9291 20.6129C58.9291 20.2945 59.6108 20.3458 59.9892 20.5517L60.1779 20.1891C59.6396 19.8486 58.4475 19.8546 58.4475 20.6471C58.4475 21.4446 59.7593 21.1101 59.7593 21.4838C59.7593 21.8353 58.9858 21.8072 58.5734 21.528L58.3733 21.8795C59.0147 22.3034 60.2408 22.214 60.2408 21.4607V21.4617ZM62.2692 21.98L62.1434 21.6003C61.9258 21.7168 61.4443 21.8454 61.4443 21.3713V20.4452H62.195V20.0324H61.4443V19.4076H60.974V20.0324H60.5389V20.4402H60.974V21.3723C60.974 22.3546 61.965 22.1758 62.2692 21.98ZM63.0303 21.2327H64.606C64.606 20.3287 64.1821 19.9711 63.6088 19.9711C63.0014 19.9711 62.5662 20.4121 62.5662 21.0479C62.5662 22.1919 63.8614 22.3817 64.5029 21.8403L64.2853 21.5059C63.8388 21.8634 63.1623 21.8293 63.0303 21.2327ZM66.4168 20.0334C66.1538 19.9219 65.7527 19.9329 65.5465 20.2785V20.0334H65.0762V22.0814H65.5465V20.9263C65.5465 20.2785 66.0909 20.3628 66.2796 20.4573L66.4168 20.0334ZM67.0242 21.0539C67.0242 20.4171 67.6893 20.2112 68.2101 20.5848L68.4277 20.2222C67.7625 19.715 66.554 19.9932 66.554 21.0589C66.554 22.1638 67.8368 22.3867 68.4277 21.8956L68.2101 21.533C67.6831 21.8956 67.0242 21.6786 67.0242 21.0529V21.0539ZM70.8448 20.0334H70.3746V20.2785C69.8992 19.6648 68.6618 20.0113 68.6618 21.0539C68.6618 22.1256 69.9446 22.4319 70.3746 21.8293V22.0864H70.8448V20.0334ZM72.7753 20.0334C72.6381 19.9661 72.1452 19.8717 71.9049 20.2785V20.0334H71.4522V22.0814H71.9049V20.9263C71.9049 20.3126 72.4205 20.3518 72.6381 20.4573L72.7753 20.0334ZM75.0842 19.2017H74.6315V20.2785C74.1612 19.6708 72.9186 19.9942 72.9186 21.0539C72.9186 22.1366 74.2077 22.4259 74.6315 21.8293V22.0864H75.0842V19.2017ZM75.5204 15.0113V15.2684H75.5658V15.0113H75.674V14.9671H75.41V15.0113H75.5204ZM75.8978 21.9187C75.8978 21.8906 75.8978 21.8574 75.8813 21.8293C75.8638 21.8122 75.8524 21.7851 75.8359 21.768C75.8194 21.7509 75.7906 21.7399 75.773 21.7238C75.7442 21.7238 75.7101 21.7068 75.6813 21.7068C75.6637 21.7068 75.6359 21.7238 75.6008 21.7238C75.578 21.7359 75.5569 21.7508 75.5379 21.768C75.509 21.7841 75.4925 21.8122 75.4925 21.8293C75.475 21.8574 75.475 21.8906 75.475 21.9187C75.475 21.9358 75.475 21.9629 75.4925 21.997C75.4925 22.0141 75.5101 22.0412 75.5379 22.0583C75.5558 22.0768 75.5772 22.0918 75.6008 22.1025C75.6297 22.1186 75.6637 22.1186 75.6813 22.1186C75.7101 22.1186 75.7442 22.1186 75.773 22.1025C75.7906 22.0854 75.8184 22.0744 75.8359 22.0583C75.8535 22.0422 75.8648 22.0141 75.8813 21.997C75.8978 21.9639 75.8978 21.9358 75.8978 21.9187ZM76.0814 14.9611H76.0009L75.9092 15.1559L75.8174 14.9611H75.7369V15.2624H75.7823V15.0334L75.8741 15.2282H75.937L76.0174 15.0334V15.2624H76.0803L76.0814 14.9611ZM76.333 10.4683C76.333 6.21559 72.7753 2.75135 68.3988 2.75135C66.8401 2.75545 65.3167 3.20339 64.0161 4.04002C68.1472 7.34958 68.2101 13.6101 64.0161 16.9026C65.3162 17.7403 66.84 18.1884 68.3988 18.1913C72.7753 18.1973 76.333 14.7371 76.333 10.4683Z" fill="#5A4E4D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M95 3.12524C95 1.40649 96.3619 0.000244141 98.0265 0.000244141H122.238C123.041 0.000244141 123.811 0.329484 124.378 0.915535C124.946 1.50159 125.265 2.29644 125.265 3.12524V21.8752C125.265 22.704 124.946 23.4989 124.378 24.085C123.811 24.671 123.041 25.0002 122.238 25.0002H98.0265C97.2238 25.0002 96.454 24.671 95.8864 24.085C95.3189 23.4989 95 22.704 95 21.8752V3.12524ZM113.915 8.12525C114.521 8.12525 115.126 8.12525 115.58 8.43775L115.429 10.0002H115.277C114.822 9.70841 114.3 9.54665 113.764 9.5315C113.008 9.5315 112.705 10.0002 112.705 10.3127C112.705 10.6252 113.008 10.7815 113.764 11.094C114.823 11.719 115.277 12.344 115.277 13.1252C115.277 14.6877 114.067 15.7815 111.948 15.7815C111.04 15.7815 110.284 15.469 109.83 15.3127L110.132 13.7502H110.284C110.889 14.0627 111.343 14.219 112.1 14.219C112.705 14.219 113.31 13.9065 113.31 13.4377C113.31 13.1252 113.008 12.969 112.251 12.5002C111.494 12.1877 110.586 11.5627 110.586 10.469C110.586 9.06275 112.1 8.12525 113.915 8.12525ZM119.212 8.12525H120.725L122.238 15.6252H120.422L120.12 14.5315H117.699L117.245 15.6252H115.277L118.153 8.75024C118.304 8.28149 118.606 8.2815 119.212 8.2815V8.12525ZM109.83 8.12525H107.863L106.652 15.6252H108.619L109.83 8.12525ZM103.02 13.2815L102.869 12.1877L102.112 8.75024C102.112 8.28149 101.658 8.2815 101.204 8.12525H98.1778V8.2815L99.9937 9.06275L100.145 9.37525L101.81 15.6252H104.079L107.106 8.2815H105.139L103.171 13.2815H103.02Z" fill="#5A4E4D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M172.665 0.00024432C173.573 -4.08223e-05 174.448 0.340256 175.114 0.952917C175.78 1.56558 176.188 2.40532 176.256 3.30382L176.265 3.57167V21.4288C176.265 22.3298 175.922 23.1977 175.304 23.8584C174.687 24.519 173.84 24.9237 172.935 24.9913L172.665 25.0002H143.865C142.957 25.0005 142.082 24.6602 141.416 24.0476C140.75 23.4349 140.342 22.5952 140.274 21.6967L140.265 21.4288V3.57167C140.264 2.67064 140.608 1.8028 141.225 1.14212C141.843 0.481442 142.689 0.0767502 143.595 0.0091731L143.865 0.00024432H172.665ZM167.27 3.57167H149.259L149.265 3.79489C149.265 4.46908 149.131 5.13668 148.871 5.75956C148.611 6.38243 148.23 6.94839 147.749 7.42512C147.269 7.90185 146.698 8.28001 146.07 8.53802C145.442 8.79602 144.769 8.92882 144.09 8.92882L143.865 8.92346V16.077L144.09 16.0717C145.462 16.0717 146.779 16.6126 147.749 17.5754C148.72 18.5382 149.265 19.844 149.265 21.2056L149.259 21.4288H167.27L167.265 21.2056C167.265 19.8962 167.769 18.6364 168.674 17.6837C169.58 16.731 170.818 16.1576 172.136 16.0806L172.553 16.0735L172.665 16.077V8.92346L172.44 8.92882C171.12 8.9288 169.85 8.42851 168.89 7.53028C167.929 6.63205 167.351 5.40376 167.274 4.09667L167.265 3.68239L167.27 3.57167ZM172.44 19.6431C172.214 19.6431 171.991 19.6913 171.785 19.7844C171.58 19.8775 171.397 20.0134 171.249 20.1827C171.101 20.3521 170.992 20.551 170.928 20.766C170.865 20.981 170.849 21.2071 170.881 21.4288H172.665V19.6592C172.59 19.6492 172.515 19.6438 172.44 19.6431ZM144.09 19.6431C144.015 19.6438 143.939 19.6492 143.865 19.6592V21.4288H145.649C145.681 21.2071 145.665 20.981 145.601 20.766C145.538 20.551 145.428 20.3521 145.28 20.1827C145.132 20.0134 144.95 19.8775 144.744 19.7844C144.539 19.6913 144.316 19.6431 144.09 19.6431ZM158.265 5.35739C160.174 5.35739 162.006 6.10994 163.356 7.44948C164.706 8.78903 165.465 10.6058 165.465 12.5002C165.465 14.3946 164.706 16.2115 163.356 17.551C162.006 18.8906 160.174 19.6431 158.265 19.6431C156.355 19.6431 154.524 18.8906 153.174 17.551C151.823 16.2115 151.065 14.3946 151.065 12.5002C151.065 10.6058 151.823 8.78903 153.174 7.44948C154.524 6.10994 156.355 5.35739 158.265 5.35739ZM158.265 8.92882C157.31 8.92882 156.394 9.30509 155.719 9.97486C155.044 10.6446 154.665 11.553 154.665 12.5002C154.665 13.4474 155.044 14.3559 155.719 15.0256C156.394 15.6954 157.31 16.0717 158.265 16.0717C159.22 16.0717 160.135 15.6954 160.81 15.0256C161.485 14.3559 161.865 13.4474 161.865 12.5002C161.865 11.553 161.485 10.6446 160.81 9.97486C160.135 9.30509 159.22 8.92882 158.265 8.92882ZM145.649 3.57167H143.865V5.34132C144.088 5.37332 144.316 5.35727 144.533 5.29423C144.75 5.2312 144.95 5.12267 145.121 4.976C145.292 4.82932 145.428 4.64794 145.522 4.44415C145.616 4.24037 145.665 4.01894 145.665 3.79489L145.661 3.68239L145.649 3.57167ZM172.665 3.57167H170.881C170.849 3.79342 170.865 4.01947 170.928 4.23447C170.992 4.44947 171.101 4.6484 171.249 4.81777C171.397 4.98713 171.58 5.12298 171.785 5.21608C171.991 5.30919 172.214 5.35738 172.44 5.35739L172.553 5.35382L172.665 5.33953V3.57167Z" fill="#5A4E4D"/>
</svg>

          </CheckoutCardInfo>
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
  max-width: ${pxToRem(900)};
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
`;

const ProductTitle = styled.h1`
  font-size: ${fontSizes.xl};
  font-family: ${fonts.title};
  font-weight: 800;
  line-height: 1.2;
  color: ${colors.text};
  margin: 0 0 8px 0;
  letter-spacing: 1px;
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
  justify-content: space-between;
  align-items: center;
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
  font-weight: 600;
  font-size: ${fontSizes.base};
  border-radius: ${pxToRem(6)};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${pxToRem(8)};
  &:hover {
    background: #a084ca;
    color: #fff;
  }
`;

const BuyNowBtn = styled(Button)`
  flex: 1;
  background: ${colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: ${pxToRem(6)};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${pxToRem(8)};
  &:hover {
    background: #a084ca;
    color: #fff;
  }
`;

const WishlistBtn = styled.button`
  background: #fff;
border: ${pxToRem(1)} solid ${({ $wished }) => ($wished ? colors.accent : '#d3d3d3')};
  border-radius: ${pxToRem(8)};
  color: ${({ $wished }) => ($wished ? `${colors.accent}` : '#d3d3d3')};
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