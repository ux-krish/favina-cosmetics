import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
import productData from '../../data/product.json';

const categoryInfo = [
  {
    key: 'makeup',
    name: 'Makeup',
    banner: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    key: 'haircare',
    name: 'Haircare',
    banner: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    key: 'fragrance',
    name: 'Fragrance',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    key: 'skincare',
    name: 'Skincare',
    banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  },
];

const CategoryListPage = () => {
  const allProducts = productData.products || [];

  return (
    <Container>
      <h1 style={{ textAlign: 'center', marginBottom: 40 }}>Shop by Category</h1>
      {categoryInfo.map(cat => {
        const products = allProducts.filter(
          p => p.category && p.category.toLowerCase() === cat.key
        ).slice(0, 4);

        return (
          <CategorySection key={cat.key}>
            <Banner style={{ backgroundImage: `url(${cat.banner})` }}>
              <BannerOverlay>
                <CategoryTitle>
                  <Link to={`/category/${cat.key}`}>{cat.name}</Link>
                </CategoryTitle>
              </BannerOverlay>
            </Banner>
            <ProductGrid products={products} />
            <ViewAllLink to={`/category/${cat.key}`}>View all {cat.name} products →</ViewAllLink>
          </CategorySection>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const CategorySection = styled.section`
  margin-bottom: 60px;
`;

const Banner = styled.div`
  width: 100%;
  height: 220px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
`;

const BannerOverlay = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 100%);
  display: flex;
  align-items: flex-end;
  padding: 30px;
`;

const CategoryTitle = styled.h2`
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);

  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      color: #e74c3c;
    }
  }
`;

const ViewAllLink = styled(Link)`
  display: inline-block;
  margin-top: 10px;
  color: #e74c3c;
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default CategoryListPage;

