import styled, { keyframes } from 'styled-components';
import { FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes, FaPencilAlt, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '../../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { useState, useEffect } from 'react';
import LogoSvg from '../../assets/images/logo.svg';
import productData from '../../data/product.json';
import { useImageBasePath } from '../../context/ImagePathContext';

const offerMessages = [
  "💄 Cosmetics Offer: Up to 40% OFF on Makeup Essentials!",
  "🎁 Exclusive Discount: Free Shipping on Orders Over $49!",
  "🌟 New Arrivals: Discover the Latest Beauty Trends!",
  "🛍️ Buy 2 Get 1 Free on Select Skincare Products!",
  "✨ Members Only: Extra 10% OFF for Registered Users!",
];

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownMobileOpen, setUserDropdownMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const imageBasePath = useImageBasePath();

  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };
    updateWishlistCount();
    window.addEventListener('storage', updateWishlistCount);
    return () => window.removeEventListener('storage', updateWishlistCount);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = (productData.products || []).filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    const handleClick = (e) => {
      if (e.target.closest('.search-overlay-content')) return;
      setSearchOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [searchOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <HeaderContainer>
      <Banner>
        {/* <BannerIcon>
          <FaPencilAlt />
        </BannerIcon> */}
        <Carousel>
          <CarouselTrack>
            {offerMessages.map((msg, idx) => (
              <CarouselItem key={idx}>{msg}</CarouselItem>
            ))}
            {/* Duplicate for seamless loop */}
            {offerMessages.map((msg, idx) => (
              <CarouselItem key={`dup-${idx}`}>{msg}</CarouselItem>
            ))}
          </CarouselTrack>
        </Carousel>
      </Banner>
      <Container>
        <Logo to="/" title="Go to Home">
          <LogoImg src={LogoSvg} alt="ShopEase Logo" />
        </Logo>
        <Nav>
          <NavLink to="/" title="Home">Home</NavLink>
          <NavLink to="/products" title="Browse all products">Products</NavLink>
          <CategoryDropdown
            tabIndex={0}
            onMouseEnter={() => setCatDropdownOpen(true)}
            onMouseLeave={() => setCatDropdownOpen(false)}
            onFocus={() => setCatDropdownOpen(true)}
            onBlur={e => {
              if (!e.currentTarget.contains(e.relatedTarget)) setCatDropdownOpen(false);
            }}
          >
            <NavLink
              as={Link}
              to="/category"
              aria-haspopup="true"
              aria-expanded={catDropdownOpen}
              title="Browse by category"
            >
              Categories
            </NavLink>
            <CategoryMenu $open={catDropdownOpen}>
              <CategoryMenuItem to="/category/makeup" title="Makeup">Makeup</CategoryMenuItem>
              <CategoryMenuItem to="/category/haircare" title="Haircare">Haircare</CategoryMenuItem>
              <CategoryMenuItem to="/category/fragrance" title="Fragrance">Fragrance</CategoryMenuItem>
              <CategoryMenuItem to="/category/skincare" title="Skincare">Skincare</CategoryMenuItem>
              <CategoryMenuItem to="/category" title="All Categories">All Categories</CategoryMenuItem>
            </CategoryMenu>
          </CategoryDropdown>
          <NavLink to="/contact" title="Contact us">Contact</NavLink>
        </Nav>
        <Icons>
          <SearchIconBtn
            aria-label="Search"
            title="Search products"
            onClick={() => setSearchOpen(true)}
          >
            <FaSearch />
          </SearchIconBtn>
          {/* Only show user icon on desktop */}
          <UserDropdown
            tabIndex={0}
            style={{ display: window.innerWidth <= 900 ? 'none' : 'flex' }}
            // Only use hover/focus handlers on desktop
            onMouseEnter={() => window.innerWidth > 900 && setDropdownOpen(true)}
            onMouseLeave={() => window.innerWidth > 900 && setDropdownOpen(false)}
            onFocus={() => window.innerWidth > 900 && setDropdownOpen(true)}
            onBlur={e => {
              if (window.innerWidth > 900 && !e.currentTarget.contains(e.relatedTarget)) setDropdownOpen(false);
            }}
          >
            <UserIconBtn
              aria-haspopup="true"
              aria-expanded={dropdownOpen || userDropdownMobileOpen}
              tabIndex={-1}
              title={isAuthenticated ? "Account" : "Login/Register"}
              // On mobile, toggle dropdown on click
              onClick={() => {
                if (window.innerWidth <= 900) setUserDropdownMobileOpen(v => !v);
              }}
            >
              <FaUser />
              {isAuthenticated && user?.firstName && (
                <UserName>{user.firstName}</UserName>
              )}
            </UserIconBtn>
            <DropdownMenu
              $open={window.innerWidth > 900 ? dropdownOpen : userDropdownMobileOpen}
              // On mobile, clicking outside closes the menu
              style={window.innerWidth <= 900 ? { right: 0, left: 'auto' } : {}}
            >
              {!isAuthenticated ? (
                <>
                  <DropdownItem to="/login" title="Login" onClick={() => setUserDropdownMobileOpen(false)}>Login</DropdownItem>
                  <DropdownItem to="/register" title="Register" onClick={() => setUserDropdownMobileOpen(false)}>Register</DropdownItem>
                </>
              ) : (
                <>
                  <DropdownItem to="/account" title="My Account" onClick={() => setUserDropdownMobileOpen(false)}>My Account</DropdownItem>
                  <DropdownButton onClick={() => { handleLogout(); setUserDropdownMobileOpen(false); }} title="Logout">Logout</DropdownButton>
                </>
              )}
            </DropdownMenu>
          </UserDropdown>
          <WishlistButton
            as={Link}
            to="/wishlist"
            aria-label="Wishlist"
            title="View Wishlist"
            className="wishlist-header-icon"
          >
            <FaHeart />
            {wishlistCount > 0 && <WishlistCount>{wishlistCount}</WishlistCount>}
          </WishlistButton>
          <CartButton onClick={() => dispatch(toggleCart())} title="View Cart">
            <FaShoppingCart />
            {items.length > 0 && <CartCount>{items.length}</CartCount>}
          </CartButton>
          <MobileMenuIcon
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)
            }
          >
            <FaBars />
          </MobileMenuIcon>
        </Icons>
      </Container>
      {/* Search Overlay */}
      {searchOpen && (
        <SearchBarWrapper>
          <SearchBarInner className="search-overlay-content">
            <SearchInput
              autoFocus
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <CloseSearchBtn onClick={() => setSearchOpen(false)} aria-label="Close search">
              <FaTimes />
            </CloseSearchBtn>
            {searchTerm && (
              <SearchResults>
                {searchResults.length === 0 ? (
                  <NoResults>No products found.</NoResults>
                ) : (
                  searchResults.map(product => (
                    <SearchResultItem
                      key={product.id}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchTerm('');
                        navigate(`/products/${product.id}`);
                      }}
                    >
                      <ResultImg src={
                        product.image && !product.image.includes('/') && product.image
                          ? `${imageBasePath}/${product.image}`
                          : product.image
                      } alt={product.title} />
                      <ResultInfo>
                        <ResultTitle>{product.title}</ResultTitle>
                        <ResultPrice>${product.price.toFixed(2)}</ResultPrice>
                      </ResultInfo>
                    </SearchResultItem>
                  ))
                )}
              </SearchResults>
            )}
          </SearchBarInner>
        </SearchBarWrapper>
      )}
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <MobileMenuOverlay onClick={() => setMobileMenuOpen(false)} />
          <MobileMenu>
            <MobileMenuHeader>
              <Logo to="/" onClick={() => setMobileMenuOpen(false)}>
                <LogoImg src={LogoSvg} alt="ShopEase Logo" />
              </Logo>
              <MobileMenuClose
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaTimes />
              </MobileMenuClose>
            </MobileMenuHeader>
            <MobileNav>
              {/* Add user/account section at the top of the menu */}
              {isAuthenticated ? (
                <MobileAccountSection>
                  <MobileAccountLabel>
                    My Account
                    <MobileAccountName>
                      {user?.firstName ? `(${user.firstName})` : ''}
                    </MobileAccountName>
                  </MobileAccountLabel>
                  <MobileNavLink to="/account" onClick={() => setMobileMenuOpen(false)}>
                    Account Dashboard
                  </MobileNavLink>
                  <MobileNavButton onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                    Logout
                  </MobileNavButton>
                  <MobileDivider />
                </MobileAccountSection>
              ) : (
                <>
                  <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Login</MobileNavLink>
                  <MobileNavLink to="/register" onClick={() => setMobileMenuOpen(false)}>Register</MobileNavLink>
                  <MobileDivider />
                </>
              )}
              <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/products" onClick={() => setMobileMenuOpen(false)}>Products</MobileNavLink>
              <MobileCategory>
                <MobileCategoryToggle tabIndex={0}>
                  Categories
                  <MobileCategoryList>
                    <MobileCategoryItem to="/category/makeup" onClick={() => setMobileMenuOpen(false)}>Makeup</MobileCategoryItem>
                    <MobileCategoryItem to="/category/haircare" onClick={() => setMobileMenuOpen(false)}>Haircare</MobileCategoryItem>
                    <MobileCategoryItem to="/category/fragrance" onClick={() => setMobileMenuOpen(false)}>Fragrance</MobileCategoryItem>
                    <MobileCategoryItem to="/category/skincare" onClick={() => setMobileMenuOpen(false)}>Skincare</MobileCategoryItem>
                    <MobileCategoryItem to="/category" onClick={() => setMobileMenuOpen(false)}>All Categories</MobileCategoryItem>
                  </MobileCategoryList>
                </MobileCategoryToggle>
              </MobileCategory>
              <MobileNavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</MobileNavLink>
              <MobileDivider />
              <MobileNavLink to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                Wishlist {wishlistCount > 0 && <MobileBadge>{wishlistCount}</MobileBadge>}
              </MobileNavLink>
              <MobileNavLink as="button" onClick={() => { setMobileMenuOpen(false); dispatch(toggleCart()); }}>
                Cart {items.length > 0 && <MobileBadge>{items.length}</MobileBadge>}
              </MobileNavLink>
            </MobileNav>
          </MobileMenu>
        </>
      )}
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const LogoImg = styled.img`
  height: 38px;
  width: auto;
  display: block;

`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
  @media (max-width: 900px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 23px 0; 

  &:hover {
    color: #666;
  }
`;

const MobileMenuIcon = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  margin-left: 10px;
  svg{
    height:auto;
    width: 19px;
  }
  @media (max-width: 900px) {
    display: block;
  }
`;

const Icons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  @media (max-width: 900px) {
    .wishlist-header-icon {
      display: none;
    }
  }
`;

const SearchIconBtn = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 2px;
  margin-right: 2px;
  &:hover {
    color: #e5a6a6;
  }
`;

const UserDropdown = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  outline: none;
`;

const UserIconBtn = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 25px 0; 

  &:hover {
    color: #666;
  }
`;

const UserName = styled.span`
  margin-left: 8px;
  font-weight: 500;
  color: #333;
  font-size: 15px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  width: 220px;
  background: white;
  border: 1px solid #eee;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  z-index: 120;
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  padding: 8px 0;
  animation: ${({ $open }) => ($open ? 'fadeInMenu 0.18s' : 'none')};
  margin-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;

  /* Attach to header bottom */
  /* Ensure the menu is attached to the bottom of the header, not just the icon */
  /* Override right: 0 if present elsewhere */
  right: auto;

  @keyframes fadeInMenu {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const DropdownItem = styled(Link)`
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  font-size: 15px;
  background: none;
  border: none;
  text-align: left;

  &:hover {
    background: #f5f5f5;
    color: #111;
  }
`;

const DropdownButton = styled.button`
  padding: 10px 20px;
  color: #333;
  background: none;
  border: none;
  font-size: 15px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
    color: #111;
  }
`;

const CategoryDropdown = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  outline: none;
  cursor: pointer;
`;

const CategoryMenu = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  width: 220px;
  background: white;
  border: 1px solid #eee;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  z-index: 120;
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  padding: 8px 0;
  animation: ${({ $open }) => ($open ? 'fadeInMenu 0.18s' : 'none')};
  margin-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;

  @keyframes fadeInMenu {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const CategoryMenuItem = styled(Link)`
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  font-size: 15px;
  background: none;
  border: none;
  text-align: left;
  transition: background 0.15s, color 0.15s;
  cursor: pointer;

  &:hover, &:focus {
    background: #f5f5f5;
    color: #e74c3c;
    outline: none;
  }
`;

const WishlistButton = styled(Link)`
  background: none;
  border: none;
  font-size: 18px;
  color: #e74c3c;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 2px;
  position: relative;
  
  &:hover {
    color: #c0392b;
  }
`;

const WishlistCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff6b6b;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  
`;

const CartButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  position: relative;
  cursor: pointer;
  color: #333;
  padding: 0 0;
  position:relative;
  top:2px;
  &:hover {
    color: #666;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff6b6b;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

// --- Mobile Menu Styles ---

const MobileMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.28);
  z-index: 999;
`;

const MobileMenu = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 82vw;
  max-width: 340px;
  height: 100vh;
  background: #fff;
  z-index: 1000;
  box-shadow: 2px 0 16px rgba(0,0,0,0.13);
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.22s;
  @keyframes slideInLeft {
    from { transform: translateX(-100%);}
    to { transform: translateX(0);}
  }
  /* Allow scrolling for overflowing content */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 20px 10px 20px;
  border-bottom: 1px solid #eee;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 2;
`;

const MobileMenuClose = styled.button`
  background: none;
  border: none;
  font-size: 26px;
  color: #333;
  cursor: pointer;
`;

const MobileNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 20px 0 0 0;
`;

const MobileNavLink = styled(Link)`
  padding: 14px 28px;
  color: #222;
  font-size: 17px;
  text-decoration: none;
  font-weight: 500;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
    color: #e74c3c;
  }
`;

const MobileNavButton = styled.button`
  padding: 14px 28px;
  color: #222;
  font-size: 15px;
  font-weight: 500;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
    color: #e74c3c;
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: #eee;
  margin: 10px 0;
`;

const MobileBadge = styled.span`
  display: inline-block;
  margin-left: 8px;
  background: #e74c3c;
  color: #fff;
  border-radius: 10px;
  font-size: 13px;
  padding: 2px 8px;
  min-width: 20px;
  text-align: center;
`;

const MobileCategory = styled.div`
  position: relative;
`;

const MobileCategoryToggle = styled.div`
  padding: 14px 28px 0 28px;
  color: #222;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  &:hover > div {
    display: block;
  }
`;

const MobileCategoryList = styled.div`
  display: block;
  background: #f9f9f9;
  border-radius: 0 0 8px 8px;
  margin-top: 2px;
  margin-left: -8px;
  margin-right: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const MobileCategoryItem = styled(Link)`
  display: block;
  padding: 12px 36px;
  color: #333;
  font-size: 16px;
  text-decoration: none;
  &:hover {
    background: #f5f5f5;
    color: #e74c3c;
  }
`;

const Banner = styled.div`
  width: 100%;
  background: #C8BFE7;
  color: #fff;
  display: flex;
  align-items: center;
  min-height: 38px;
  font-size: 15px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  z-index: 110;
`;

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const Carousel = styled.div`
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  min-width: 0;
`;

const CarouselTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${scroll} 28s linear infinite;
`;

const CarouselItem = styled.div`
  display: inline-block;
  padding: 0 38px;
  font-size: 15px;
  color: #fff;
  white-space: nowrap;
`;

const SearchBarWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 110px;
  z-index: 2000;
  display: flex;
  justify-content: center;
  width: 100vw;
`;

const SearchBarInner = styled.div`
  background: #fff;
  border-radius: 0 0 12px 12px;
  padding: 10px 28px 10px 28px;
  min-width: 350px;
  max-width: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 0;
`;

const SearchOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(40, 30, 50, 0.18);
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 90px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0 48px 0 18px;
  min-height: 40px;
  font-size: 14px;
  border-radius: 8px;
  border: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  outline: none;
  background: #faf9fa;
`;

const CloseSearchBtn = styled.button`
  position: absolute;
  top: 22px;
  right: 40px;
  background: none;
  border: none;
  color: #888;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    color: #e5a6a6;
  }
`;

const SearchResults = styled.div`
  max-height: 320px;
  overflow-y: auto;
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.13s;
  &:hover {
    background: #f7f7f7;
  }
`;

const ResultImg = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 7px;
  background: #fafafa;
`;

const ResultInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ResultTitle = styled.div`
  font-size: 16px;
  color: #222;
  font-weight: 500;
`;

const ResultPrice = styled.div`
  font-size: 15px;
  color: #e5a6a6;
  font-weight: 600;
`;

const NoResults = styled.div`
  color: #888;
  font-size: 15px;
  padding: 18px 0 0 0;
  text-align: center;
`;

const MobileAccountSection = styled.div`
  padding: 18px 28px 0 28px;
  background: #faf9fa;
  border-bottom: 1px solid #eee;
`;

const MobileAccountLabel = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #5b4a44;
  margin-bottom: 4px;
`;

const MobileAccountName = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #e5a6a6;
  margin-left: 6px;
`;

export default Header;