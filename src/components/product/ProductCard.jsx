import styled from 'styled-components';
import { useAppDispatch } from '../../redux/hooks';
import { addToCart } from '../../redux/slices/cartSlice';
import Button from '../common/Button';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useImageBasePath } from '../../context/ImagePathContext';
import { useAuth } from '../../redux/hooks';

const ProductCard = ({ product }) => {
  const dispatch = useAppDispatch();
  const [wishlist, setWishlist] = useState([]);
  const isWished = wishlist.includes(product.id);
  const [toast, setToast] = useState(null);
  const imageBasePath = useImageBasePath();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Helper to get/set wishlist as array of product IDs in localStorage per user
  const getUserWishlist = () => {
    if (!user?.id) return [];
    const allWishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
    const arr = Array.isArray(allWishlists[user.id]) ? allWishlists[user.id] : [];
    // Always return array of product IDs (string or number)
    return arr.filter(id => !!id);
  };
  const setUserWishlist = (list) => {
    if (!user?.id) return;
    // Ensure unique IDs
    const uniqueList = Array.from(new Set(list)).filter(id => !!id);
    const allWishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
    allWishlists[user.id] = uniqueList;
    localStorage.setItem('wishlists', JSON.stringify(allWishlists));
    // Dispatch a custom event for instant header update
    window.dispatchEvent(new Event('wishlistChanged'));
  };

  useEffect(() => {
    setWishlist(getUserWishlist());
    const handleStorage = () => setWishlist(getUserWishlist());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
    // eslint-disable-next-line
  }, [user?.id]);

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
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
    let updatedCart;
    const userCart = getUserCart();
    const exists = userCart.find(item => item.id === product.id);
    if (exists) {
      updatedCart = userCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...userCart, { ...product, quantity: 1 }];
    }
    if (isAuthenticated) {
      setUserCart(updatedCart);
    }
    dispatch(addToCart({ ...product, quantity: 1 }));
    setToast('Added to cart');
    setTimeout(() => setToast(null), 1500);
  };

  // Toast in document body, not inside card
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

  // Discount calculation
  const discount =
    product.offerPrice && product.offerPrice < product.price
      ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
      : null;

  // Fix: Ensure correct image path for public/images usage (works in browser, not Node)
  let imageSrc = product.image;
  if (imageSrc && !imageSrc.startsWith('/') && !imageSrc.startsWith('http')) {
    imageSrc = `/${imageSrc}`;
  }

  // Only navigate to product details if not clicking on add/wishlist
  const handleCardClick = (e) => {
    // Prevent navigation if clicking on button or icon inside card
    if (
      e.target.closest('button') ||
      e.target.closest('a') ||
      e.target.closest('[role="button"]')
    ) {
      return;
    }
    navigate(`/products/${product.id}`);
  };

  return (
    <Card onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <ImageContainer>
        {/* Wishlist button at top right of image on mobile */}
        <WishlistBtn
          aria-label="Add to wishlist"
          wished={isWished ? 1 : 0}
          onClick={handleAddToWishlist}
          type="button"
        >
          <FaHeart />
        </WishlistBtn>
        <Image src={imageSrc} alt={product.title} />
      </ImageContainer>
      <Details>
        <Title title={product.title}>{product.title}</Title>
        <RatingRow>
          <StarIcon>★</StarIcon>
          <RatingValue>{product.rating ? product.rating.toFixed(1) : '4.0'}</RatingValue>
        </RatingRow>
        <GroupBox>
          <MetaRow>
          <Weight>80g</Weight>
          {discount && <DiscountBadge>{discount}% Off</DiscountBadge>}
        </MetaRow>
        <PriceRow>
          {product.offerPrice && product.offerPrice < product.price ? (
            <>
              <MRP>MRP: <Strike>${product.price.toFixed(0)}</Strike></MRP>
              <OfferPrice>${product.offerPrice.toFixed(0)}</OfferPrice>
            </>
          ) : (
            <OfferPrice>${product.price.toFixed(0)}</OfferPrice>
          )}
        </PriceRow>
        </GroupBox>
      </Details>
      <Actions>
        {/* Hide wishlist button here on mobile */}
        <IconButton
          aria-label="Add to wishlist"
          wished={isWished ? 1 : 0}
          onClick={handleAddToWishlist}
          type="button"
          style={{ display: 'none' }}
        >
          <FaHeart />
        </IconButton>
        <IconButton
          aria-label="Add to cart"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          type="button"
        >
          <FaShoppingCart />
        </IconButton>
        <ViewButton
          as={Link}
          to={`/products/${product.id}`}
          onClick={e => e.stopPropagation()}
        >
          View Product
        </ViewButton>
      </Actions>
    </Card>
  );
};

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.10);
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  position: relative;
  min-width: 0;
  transition: box-shadow 0.18s, transform 0.18s;
  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
    transform: translateY(-2px) scale(1.01);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio:1/1;
  background: #fff;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  padding-top: 18px;
`;

const Image = styled.img`
  aspect-ratio:1/1;
  width: 100%;
  object-fit: contain;
  margin-bottom: 0;
  margin-top: auto;
  display: block;
`;

const Details = styled.div`
  padding: 12px 18px 0 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 auto;
`;

const Title = styled.h3`
  font-size: 15px;
  margin: 0 0 2px 0;
  font-weight: 500;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  margin-bottom: 2px;
`;

const StarIcon = styled.span`
  color: #ffc107;
  font-size: 15px;
`;

const RatingValue = styled.span`
  color: #e74c3c;
  font-size: 15px;
  font-weight: 600;
`;
const GroupBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
`;

const Weight = styled.span`
  font-size: 13px;
  color: #888;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 2px 8px;
  font-weight: 500;
`;

const DiscountBadge = styled.span`
  font-size: 13px;
  color: #fff;
  background: #e74c3c;
  border-radius: 4px;
  padding: 2px 8px;
  font-weight: 500;
  margin-left: 4px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0 0 0;
`;

const MRP = styled.span`
  font-size: 13px;
  color: #888;
`;

const Strike = styled.span`
  text-decoration: line-through;
  color: #888;
  font-size: 13px;
`;

const OfferPrice = styled.span`
  color: #222;
  font-size: 18px;
  font-weight: 700;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px 14px 14px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  border-radius: 0 0 14px 14px;
  margin-top: 10px;
`;

const IconButton = styled.button`
  background: #f7f7f7;
  border: 1.5px solid #eee;
  border-radius: 8px;
  color: ${({ wished }) => (wished ? '#e74c3c' : '#888')};
  font-size: 18px;
  width: 38px;
  height: 38px;
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

const ViewButton = styled(Link)`
  flex: 1;
  background: #fff;
  color: #222;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  padding: 0 0;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background 0.18s, color 0.18s, border 0.18s;
  &:hover {
    background: #f5f5f5;
    color: #e74c3c;
    border-color: #e74c3c;
  }
`;

const WishlistBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 8px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.18s, transform 0.18s;
  color: ${({ wished }) => (wished ? '#e74c3c' : '#888')};
  &:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }
`;

// Add global styles for the toast
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

export default ProductCard;