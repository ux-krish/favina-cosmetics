import styled from 'styled-components';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
import productData from '../../data/product.json';

const categoryInfo = [
  {
    key: 'makeup',
    name: 'Makeup',
    banner: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    description: 'Explore our wide range of makeup products for every occasion.',
  },
  {
    key: 'haircare',
    name: 'Haircare',
    banner: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80',
    description: 'Nourish and style your hair with our premium haircare collection.',
  },
  {
    key: 'fragrance',
    name: 'Fragrance',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    description: 'Discover signature scents and perfumes for every mood.',
  },
  {
    key: 'skincare',
    name: 'Skincare',
    banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    description: 'Pamper your skin with our effective skincare essentials.',
  },
  {
    key: 'tools',
    name: 'Tools',
    banner: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    description: 'Professional tools for your beauty routine.',
  },
];

const CategoryPage = () => {
  const { categoryKey } = useParams();
  const navigate = useNavigate();
  const allProducts = productData.products || [];

  // If categoryKey is not present, redirect to first available category
  if (!categoryKey) {
    const firstAvailable = categoryInfo.find(cat =>
      allProducts.some(
        p => p.category && p.category.toLowerCase() === cat.key
      )
    );
    if (firstAvailable) {
      navigate(`/category/${firstAvailable.key}`, { replace: true });
      return null;
    }
    return <div style={{ textAlign: 'center', margin: 40 }}>No categories found.</div>;
  }

  // Only show the selected category if it has products
  const selectedCategory = categoryInfo.find(cat => cat.key === categoryKey);
  const products = allProducts.filter(
    p => p.category && p.category.toLowerCase() === categoryKey
  );

  if (!selectedCategory) {
    return <div style={{ textAlign: 'center', margin: 40 }}>Category not found.</div>;
  }

  return (
    <Container>
      <h1 style={{ textAlign: 'center', marginBottom: 40 }}>
        Shop by Category: {selectedCategory.name}
      </h1>
      <CategorySection>
        <Banner style={{ backgroundImage: `url(${selectedCategory.banner})` }}>
          <BannerOverlay>
            <CategoryName>
              <Link to={`/category/${selectedCategory.key}`}>{selectedCategory.name}</Link>
            </CategoryName>
            <CategoryDesc>{selectedCategory.description}</CategoryDesc>
          </BannerOverlay>
        </Banner>
        <ProductsWrapper>
          <ProductGrid products={products} />
        </ProductsWrapper>
      </CategorySection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const CategorySection = styled.section`
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: flex-start;
  margin-bottom: 60px;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const Banner = styled.div`
  flex: 1;
  min-width: 320px;
  height: 220px;
  background-size: cover;
  background-position: center;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
`;

const BannerOverlay = styled.div`
  width: 100%;
  background: linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 100%);
  padding: 30px 28px 24px 28px;
  border-radius: 0 0 14px 14px;
  color: #fff;
`;

const CategoryName = styled.h2`
  font-size: 2rem;
  margin: 0 0 10px 0;
  font-weight: bold;
  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      color: #e74c3c;
      text-decoration: underline;
    }
  }
`;

const CategoryDesc = styled.p`
  font-size: 1.1rem;
  margin: 0;
  color: #f5f5f5;
`;

const ProductsWrapper = styled.div`
  flex: 2;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default CategoryPage;
