import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ProductGrid from '../../components/product/ProductGrid';
import productData from '../../data/product.json';
import { FaFilter } from 'react-icons/fa';

const categories = ['All', 'Makeup', 'Skincare', 'Haircare', 'Fragrance', 'Tools'];

const MAX_PRICE = 500;
const MIN_PRICE = 0;
const PRODUCTS_PER_PAGE = 9;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('none');
  const [testimonials, setTestimonials] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch products and testimonials from src/product.json
    setProducts(productData.products || []);
    setTestimonials(productData.testimonials || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (priceRange[0] < MIN_PRICE) {
      setPriceRange([MIN_PRICE, priceRange[1]]);
    }
    if (priceRange[1] > MAX_PRICE) {
      setPriceRange([priceRange[0], MAX_PRICE]);
    }
    if (priceRange[0] > priceRange[1]) {
      setPriceRange([priceRange[1], priceRange[1]]);
    }
    // eslint-disable-next-line
  }, [priceRange[0], priceRange[1]]);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    // Only show products within the selected price range (min and max)
    filtered = filtered.filter(
      p => p.price >= Math.min(priceRange[0], priceRange[1]) && p.price <= Math.max(priceRange[0], priceRange[1])
    );
    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange]);

  // Sorting logic
  const sortedProducts = [...filteredProducts];
  if (sortOrder === 'lowToHigh') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'highToLow') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'nameAsc') {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOrder === 'nameDesc') {
    sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
  }

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange]);

  if (loading) return <div>Loading...</div>;

  // Ensure min slider cannot go above max-1 and max slider cannot go below min+1
  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), priceRange[1] - 1);
    setPriceRange([val, priceRange[1]]);
  };
  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), priceRange[0] + 1);
    setPriceRange([priceRange[0], val]);
  };

  return (
    <ProductsLayout>
      <Sidebar $open={sidebarOpen}>
        <SidebarCloseBtn
          type="button"
          aria-label="Close filters"
          onClick={() => setSidebarOpen(false)}
        >
          ×
        </SidebarCloseBtn>
        <FilterSection>
          <FilterTitle>Category</FilterTitle>
          {categories.map(cat => (
            <FilterOption key={cat}>
              <input
                type="radio"
                id={`cat-${cat}`}
                name="category"
                value={cat}
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
              />
              <label htmlFor={`cat-${cat}`}>{cat}</label>
            </FilterOption>
          ))}
        </FilterSection>
        <FilterSection>
          <FilterTitle>Price Range</FilterTitle>
          <CustomRangeSlider>
            <SliderLabels>
              <span>Min: ${priceRange[0]}</span>
              <span>Max: ${priceRange[1]}</span>
            </SliderLabels>
            <SliderTrack>
              <SliderRange
                style={{
                  left: `${((priceRange[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                  width: `${((priceRange[1] - priceRange[0]) / (MAX_PRICE - MIN_PRICE)) * 100}%`
                }}
              />
              {/* Minimum price slider */}
              <RangeInput
                type="range"
                min={MIN_PRICE}
                max={priceRange[1] - 1}
                value={priceRange[0]}
                onChange={handleMinChange}
                style={{ zIndex: priceRange[0] === priceRange[1] ? 5 : 3 }}
              />
              {/* Maximum price slider */}
              <RangeInput
                type="range"
                min={priceRange[0] + 1}
                max={MAX_PRICE}
                value={priceRange[1]}
                onChange={handleMaxChange}
                style={{ zIndex: 4 }}
              />
            </SliderTrack>
          </CustomRangeSlider>
        </FilterSection>
      </Sidebar>
      <Main>
        <PageHeader>
          <h1>All Cosmetics Products</h1>
          <HeaderRow>
            
            <FilterBox>
              <FilterIconBtn
                type="button"
                aria-label="Show filters"
                onClick={() => setSidebarOpen(true)}
              >
                <FaFilter />
              </FilterIconBtn>
              <p style={{ margin: 0 }}>
                {filteredProducts.length} products available
              </p>
              {/* Filter icon for mobile */}
              
            </FilterBox>
            <SortDropdownWrapper>
              <SortLabel htmlFor="sortOrder">Sort by:</SortLabel>
              <SortDropdown
                id="sortOrder"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="none">Default</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
              </SortDropdown>
            </SortDropdownWrapper>
          </HeaderRow>
        </PageHeader>
        <ProductGridWrapper>
          <ProductGrid products={paginatedProducts} />
        </ProductGridWrapper>
        <Pagination>
          <PageButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </PageButton>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}
          <PageButton
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </PageButton>
        </Pagination>
      </Main>
    </ProductsLayout>
  );
};

const ProductsLayout = styled.div`
  display: flex;
  max-width: 1320px;
  margin: 0 auto;
  padding: 24px 0 24px 0;
  gap: 0;
  background: #f6f3fa;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(168,132,202,0.06);
`;

const Sidebar = styled.aside`
  width: 270px;
  background: #f5f1fa;
  border-radius: 14px 0 0 14px;
  padding: 32px 22px 18px 22px;
  border-right: 1px solid #ede7f6;
  min-width: 220px;
  height: 100%;
  z-index: 1001;
  transition: transform 0.28s cubic-bezier(.4,0,.2,1);
  @media (max-width: 900px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    max-width: 270px;
    width: 82vw;
    min-width: 0;
    background: #f5f1fa;
    box-shadow: 2px 0 16px rgba(0,0,0,0.13);
    border-radius: 0 14px 14px 0;
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(-270px)')};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
    transition: transform 0.28s cubic-bezier(.4,0,.2,1), visibility 0.18s;
    z-index: 2001;
    display: block;
  }
`;

const SidebarCloseBtn = styled.button`
  display: none;
  @media (max-width: 900px) {
    display: block;
    background: none;
    border: none;
    font-size: 2rem;
    color: #888;
    position: absolute;
    top: 18px;
    right: 18px;
    z-index: 10;
    cursor: pointer;
    &:hover {
      color: #e74c3c;
    }
  }
`;

const FilterIconBtn = styled.button`
  display: none;
  @media (max-width: 900px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 6px;
    background: #f5f1fa;
    border: 1.5px solid #ede7f6;
    border-radius: 7px;
    color: #a084ca;
    font-size: 1.3rem;
    padding: 7px 12px;
    cursor: pointer;
    transition: color 0.18s, border 0.18s, background 0.18s;
    &:hover {
      color: #e74c3c;
      border-color: #e74c3c;
      background: #fff7f5;
    }
  }
`;

const FilterSection = styled.div`
  margin-bottom: 32px;
`;

const FilterTitle = styled.div`
  font-weight: 700;
  margin-bottom: 14px;
  font-size: 15px;
  color: #a084ca;
  letter-spacing: -0.5px;
`;
const FilterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex:auto;
  `
const FilterOption = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;

  input[type="radio"] {
    margin-right: 10px;
    accent-color: #a084ca;
    width: 18px;
    height: 18px;
  }
  label {
    font-size: 15px;
    color: #5b4a44;
    cursor: pointer;
    font-weight: 500;
    letter-spacing: 0;
  }
`;

const CustomRangeSlider = styled.div`
  margin-top: 10px;
  width: 100%;
  padding: 16px 0 8px 0;
`;

const SliderTrack = styled.div`
  position: relative;
  height: 6px;
  background: #ede7f6;
  border-radius: 3px;
`;

const SliderRange = styled.div`
  position: absolute;
  height: 100%;
  background: #a084ca;
  border-radius: 3px;
  z-index: 2;
`;

const RangeInput = styled.input`
  position: absolute;
  width: 100%;
  height: 24px;
  top: -9px;
  left: 0;
  background: none;
  -webkit-appearance: none;
  z-index: 3;
  pointer-events: auto;

  &::-webkit-slider-thumb {
    pointer-events: auto;
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #a084ca;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10);
    cursor: pointer;
    margin-top: -7px;
    position: relative;
    transition: border 0.2s;
  }
  &::-webkit-slider-thumb:hover {
    border: 3px solid #e74c3c;
  }
  &::-moz-range-thumb {
    pointer-events: auto;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #a084ca;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10);
    cursor: pointer;
    position: relative;
    transition: border 0.2s;
  }
  &::-moz-range-thumb:hover {
    border: 3px solid #e74c3c;
  }
  &::-ms-thumb {
    pointer-events: auto;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #a084ca;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10);
    cursor: pointer;
    position: relative;
    transition: border 0.2s;
  }
  &::-ms-thumb:hover {
    border: 3px solid #e74c3c;
  }
  &::-webkit-slider-runnable-track {
    height: 6px;
    background: transparent;
  }
  &::-ms-fill-lower, &::-ms-fill-upper {
    background: transparent;
  }
  &:focus {
    outline: none;
  }
  background: none;
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;
  color: #5b4a44;
`;

const Main = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 30px 30px 0 30px;
  background: #f6f3fa;
  border-radius: 0 14px 14px 0;
  @media (max-width: 900px) {
    padding: 18px 20px 0 20px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 20px;
  background: none;
  @media (max-width: 900px) {
    margin-bottom: 0;
  }
  h1 {
    margin-bottom: 10px;
    font-size: 1.6rem;
    color: #5b4a44;
    font-weight: 800;
    letter-spacing: -1px;
  }
  p {
    color: #a084ca;
    font-size: 1rem;
    font-weight: 500;
    @media (max-width: 600px) {
      display: none;
    }
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  width: 100%;
`;

const SortDropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 1;
`;

const SortLabel = styled.label`
  font-size: 15px;
  color: #a084ca;
  font-weight: 600;
  flex: auto;
  justify-content: flex-end;
  width: 60px;
`;

const SortDropdown = styled.select`
  padding: 7px 14px;
  border-radius: 4px;
  border: 1px solid #ede7f6;
  font-size: 15px;
  background: #fff;
  color: #5b4a44;
  font-weight: 500;
`;

const ProductGridWrapper = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 30px 30px 18px 30px;
  min-height: 480px;
  box-shadow: 0 2px 8px rgba(168,132,202,0.06);
  @media (max-width: 900px) {
    padding: 18px 0;
    background: transparent;
    box-shadow: none;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 30px 0 0 0;
`;

const PageButton = styled.button`
  padding: 6px 14px;
  border-radius: 4px;
  border: none;
  background: ${({ active }) => (active ? '#a084ca' : '#f0f0f0')};
  color: ${({ active }) => (active ? '#fff' : '#5b4a44')};
  font-weight: 500;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
  &:disabled {
    background: #eee;
    color: #aaa;
    cursor: not-allowed;
  }
`;

export default ProductsPage;