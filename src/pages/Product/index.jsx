

import styled from 'styled-components';
import Button from '../../components/common/Button';
import Checkbox from '../../components/ui/CustomCheckbox';
import Radio from '../../components/ui/CustomRadio';

import { pxToRem, colors } from '../../assets/styles/theme';
import { useEffect, useState } from 'react';
import ProductGrid from '../../components/product/ProductGrid';
import productData from '../../data/product.json';
import { FaFilter } from 'react-icons/fa';

const categories = ['Makeup', 'Skincare', 'Haircare', 'Fragrance', 'Tools'];

const MAX_PRICE = 300;
const MIN_PRICE = 0;
const PRODUCTS_PER_PAGE = 9;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('none');
  const [testimonials, setTestimonials] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState('');

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
  // Add discount property to each product
  const productsWithDiscount = products.map(p => {
    let discount = 0;
    if (p.offerPrice && p.offerPrice < p.price) {
      discount = Math.round(((p.price - p.offerPrice) / p.price) * 100);
    }
    return { ...p, discount };
  });
  let filtered = productsWithDiscount;
  if (selectedCategories.length > 0) {
    filtered = filtered.filter(p => selectedCategories.includes(p.category));
  }
  // Only show products within the selected price range (min and max)
  filtered = filtered.filter(
    p => p.price >= Math.min(priceRange[0], priceRange[1]) && p.price <= Math.max(priceRange[0], priceRange[1])
  );
  // Discount filter
  if (selectedDiscount) {
    const minDiscount = Number(selectedDiscount);
    filtered = filtered.filter(p => p.discount >= minDiscount);
  }
  setFilteredProducts(filtered);
}, [products, selectedCategories, priceRange, selectedDiscount]);

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
  }, [selectedCategories, priceRange]);

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

  // Handle category checkbox change
  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSelectedDiscount('');
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
              <Checkbox
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                id={`cat-${cat}`}
                name="category"
                value={cat}
              >
                <label htmlFor={`cat-${cat}`}>{cat}</label>
              </Checkbox>
            </FilterOption>
          ))}
        </FilterSection>
        <FilterSection>
          <FilterTitle>Price Range</FilterTitle>
          <CustomRangeSlider>
            <SliderLabels>
              <span>Start: ${priceRange[0]}</span>
              <span>End: ${priceRange[1]}</span>
            </SliderLabels>
            <SliderTrack>
              {/* Default slider bar background */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  background: '#e0e0e0',
                  borderRadius: '3px',
                  zIndex: 1,
                }}
              />
              {/* Selected range highlight */}
              <SliderRange
                style={{
                  left: `${((priceRange[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                  width: `${((priceRange[1] - priceRange[0]) / (MAX_PRICE - MIN_PRICE)) * 100}%`
                }}
              />
              {/* Start point slider */}
              <RangeInput
                type="range"
                min={MIN_PRICE}
                max={priceRange[1] - 1}
                value={priceRange[0]}
                onChange={handleMinChange}
                style={{ zIndex: priceRange[0] === priceRange[1] ? 5 : 3 }}
              />
              {/* End point slider */}
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
        <FilterSection>
          <DiscountTitle>Discount</DiscountTitle>
          <DiscountOptions>
            <DiscountOption>
              <Radio
                checked={selectedDiscount === ''}
                onChange={() => setSelectedDiscount('')}
                id="discount-any"
                name="discount"
                value=""
              >
                <label htmlFor="discount-any">Any</label>
              </Radio>
            </DiscountOption>
            <DiscountOption>
              <Radio
                checked={selectedDiscount === '10'}
                onChange={() => setSelectedDiscount('10')}
                id="discount-10"
                name="discount"
                value="10"
              >
                <label htmlFor="discount-10">10% or more</label>
              </Radio>
            </DiscountOption>
            <DiscountOption>
              <Radio
                checked={selectedDiscount === '20'}
                onChange={() => setSelectedDiscount('20')}
                id="discount-20"
                name="discount"
                value="20"
              >
                <label htmlFor="discount-20">20% or more</label>
              </Radio>
            </DiscountOption>
            <DiscountOption>
              <Radio
                checked={selectedDiscount === '30'}
                onChange={() => setSelectedDiscount('30')}
                id="discount-30"
                name="discount"
                value="30"
              >
                <label htmlFor="discount-30">30% or more</label>
              </Radio>
            </DiscountOption>
          </DiscountOptions>
        </FilterSection>
        <FilterSection>
          <ClearButton type="button" onClick={handleClearFilters}>
            Clear Filters
          </ClearButton>
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
              $active={currentPage === i + 1}
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
  align-items: stretch;
  max-width: ${pxToRem(1320)};
  margin: 0 auto;
  padding: ${pxToRem(24)} 0 ${pxToRem(24)} 0;
  gap: 0;
  /* background: #f6f3fa; */
  border-radius: ${pxToRem(14)};
  /* box-shadow: 0 2px 16px rgba(168,132,202,0.06); */
`;

const Sidebar = styled.aside`
  width: ${pxToRem(270)};
  background: ${colors.sidebarBg};
  border-radius: ${pxToRem(14)} 0 0 ${pxToRem(14)};
  padding: ${pxToRem(32)} ${pxToRem(22)} ${pxToRem(18)} ${pxToRem(22)};
  border-right: 1px solid ${colors.border};
  min-width: ${pxToRem(220)};
  height: 100%;
  z-index: 1001;
  transition: transform 0.28s cubic-bezier(.4,0,.2,1);
  @media (max-width: 900px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    max-width: ${pxToRem(270)};
    width: 82vw;
    min-width: 0;
    background: ${colors.sidebarBg};
    box-shadow: 2px 0 ${pxToRem(16)} rgba(0,0,0,0.13);
    border-radius: 0 ${pxToRem(14)} ${pxToRem(14)} 0;
    transform: ${({ $open }) => ($open ? 'translateX(0)' : `translateX(-${pxToRem(270)})`)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
    transition: transform 0.28s cubic-bezier(.4,0,.2,1), visibility 0.18s;
    z-index: 9999;
    display: block;
  }
`;

const SidebarCloseBtn = styled.button`
  display: none;
  @media (max-width: 900px) {
    display: block;
    background: none;
    border: none;
    font-size: ${pxToRem(32)};
    color: #888;
    position: absolute;
    top: ${pxToRem(18)};
    right: ${pxToRem(18)};
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
    margin-left: ${pxToRem(6)};
    background: #f5f1fa;
    border: 1.5px solid #ede7f6;
    border-radius: ${pxToRem(7)};
    color: #a084ca;
    font-size: ${pxToRem(21)};
    padding: ${pxToRem(7)} ${pxToRem(12)};
    cursor: pointer;
    transition: color 0.18s, border 0.18s, background 0.18s;
    &:hover {
      color: ${colors.accent};
      border-color: ${colors.accent};
      background: ${colors.background};
    }
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${pxToRem(32)};
`;

const FilterTitle = styled.div`
  font-weight: 700;
  margin-bottom: ${pxToRem(14)};
  font-size: ${pxToRem(15)};
  color: ${colors.highlight};
  letter-spacing: -0.031rem;
`;
const FilterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex:auto;
  `
const FilterOption = styled.div`
  margin-bottom: ${pxToRem(12)};
  display: flex;
  align-items: center;

  input[type="checkbox"] {
    margin-right: ${pxToRem(10)};
    accent-color: ${colors.accent};
    width: ${pxToRem(18)};
    height: ${pxToRem(18)};
  }
  label {
    font-size: ${pxToRem(15)};
    color: ${colors.textDark};
    cursor: pointer;
    font-weight: 500;
    letter-spacing: 0;
  }
`;

const DiscountTitle = styled.div`
  font-weight: 700;
  margin-bottom: 14px;
  font-size: 15px;
  color: ${colors.accent};
  letter-spacing: -0.5px;
`;

const DiscountOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DiscountOption = styled.div`
  display: flex;
  align-items: center;
  input[type="radio"] {
    margin-right: 10px;
    accent-color: ${colors.accent};
    width: 18px;
    height: 18px;
  }
  label {
    font-size: 15px;
    color: ${colors.textDark};
    cursor: pointer;
    font-weight: 500;
    letter-spacing: 0;
  }
`;

const ClearButton = styled(Button)`
  background: ${colors.textLight};
  color: ${colors.warning};
  border: 1.5px solid ${colors.warning};
  border-radius: ${pxToRem(7)};
  padding: ${pxToRem(7)} ${pxToRem(18)};
  font-size: ${pxToRem(15)};
  font-weight: 600;
  cursor: pointer;
  margin-top: ${pxToRem(8)};
  transition: background 0.18s, color 0.18s, border 0.18s;
  &:hover {
    background: ${colors.warning};
    color: #fff;
    border-color: ${colors.warning};
  }
`;

const CustomRangeSlider = styled.div`
  margin-top: ${pxToRem(10)};
  width: 100%;
  padding: ${pxToRem(16)} 0 ${pxToRem(8)} 0;
`;

const SliderTrack = styled.div`
  position: relative;
  height: ${pxToRem(6)};
  background: ${colors.sliderTrack};
  border-radius: ${pxToRem(3)};
`;

const SliderRange = styled.div`
  position: absolute;
  height: 100%;
  background: ${colors.accent};
  border-radius: ${pxToRem(3)};
  z-index: 2;
`;

const RangeInput = styled.input`
  position: absolute;
  width: 100%;
  height: ${pxToRem(24)};
  top: -${pxToRem(9)};
  left: 0;
  background: none;
  -webkit-appearance: none;
  z-index: 3;
  pointer-events: auto;

  &::-webkit-slider-thumb {
    pointer-events: auto;
    -webkit-appearance: none;
    height: ${pxToRem(20)};
    width: ${pxToRem(20)};
    border-radius: 50%;
    background: #fff;
    border: ${pxToRem(3)} solid ${colors.accent};
    box-shadow: 0 ${pxToRem(2)} ${pxToRem(6)} rgba(0,0,0,0.10);
    cursor: pointer;
    margin-top: -${pxToRem(7)};
    position: relative;
    transition: border 0.2s;
  }
  &::-webkit-slider-thumb:hover {
    border: ${pxToRem(3)} solid ${colors.danger};
  }
  &::-moz-range-thumb {
    pointer-events: auto;
    height: ${pxToRem(20)};
    width: ${pxToRem(20)};
    border-radius: 50%;
    background: #fff;
    border: ${pxToRem(3)} solid ${colors.accent};
    box-shadow: 0 ${pxToRem(2)} ${pxToRem(6)} rgba(0,0,0,0.10);
    cursor: pointer;
    position: relative;
    transition: border 0.2s;
  }
  &::-moz-range-thumb:hover {
    border: ${pxToRem(3)} solid ${colors.danger};
  }
  &::-ms-thumb {
    pointer-events: auto;
    height: ${pxToRem(20)};
    width: ${pxToRem(20)};
    border-radius: 50%;
    background: #fff;
    border: ${pxToRem(3)} solid ${colors.accent};
    box-shadow: 0 ${pxToRem(2)} ${pxToRem(6)} rgba(0,0,0,0.10);
    cursor: pointer;
    position: relative;
    transition: border 0.2s;
  }
  &::-ms-thumb:hover {
    border: ${pxToRem(3)} solid ${colors.danger};
  }
  &::-webkit-slider-runnable-track {
    height: ${pxToRem(6)};
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
  padding: 30px 30px 30px 30px;
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
  text-align:right;
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
  padding: 30px 30px 30px 30px;
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
  background: ${({ $active }) => ($active ? '#a084ca' : '#f0f0f0')};
  color: ${({ $active }) => ($active ? '#fff' : '#5b4a44')};
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