import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ProductGrid from '../../components/product/ProductGrid';
import productData from '../../data/product.json';

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
      <Sidebar>
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
          <HeaderRow>
            <div>
              <h1>All Cosmetics Products</h1>
              <p>{filteredProducts.length} products available</p>
            </div>
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
        <ProductGrid products={paginatedProducts} />
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
`;

const Sidebar = styled.aside`
  width: 250px;
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #eee;
  height: fit-content;

  @media (max-width: 900px) {
    display: none;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 30px;
`;

const FilterTitle = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
`;

const FilterOption = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;

  input[type="radio"] {
    margin-right: 8px;
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
  background: #eee;
  border-radius: 3px;
`;

const SliderRange = styled.div`
  position: absolute;
  height: 100%;
  background: #e74c3c;
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
  pointer-events: auto; /* <-- fix: always allow pointer events */

  &::-webkit-slider-thumb {
    pointer-events: auto;
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #e74c3c;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10);
    cursor: pointer;
    margin-top: -7px;
    position: relative;
    transition: border 0.2s;
  }
  &::-webkit-slider-thumb:hover {
    border: 3px solid #c0392b;
  }
  &::-moz-range-thumb {
    pointer-events: auto;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #e74c3c;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10);
    cursor: pointer;
    position: relative;
    transition: border 0.2s;
  }
  &::-moz-range-thumb:hover {
    border: 3px solid #c0392b;
  }
  &::-ms-thumb {
    pointer-events: auto;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #e74c3c;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10);
    cursor: pointer;
    position: relative;
    transition: border 0.2s;
  }
  &::-ms-thumb:hover {
    border: 3px solid #c0392b;
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
  color: #333;
`;

const Main = styled.div`
  flex: 1;
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
  
  h1 {
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
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
  background: ${({ active }) => (active ? '#e74c3c' : '#f0f0f0')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
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

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  flex-wrap: wrap;
  gap: 20px;
`;

const SortDropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SortLabel = styled.label`
  font-size: 15px;
  color: #333;
`;

const SortDropdown = styled.select`
  padding: 7px 14px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 15px;
  background: #fff;
  color: #333;
`;

export default ProductsPage;