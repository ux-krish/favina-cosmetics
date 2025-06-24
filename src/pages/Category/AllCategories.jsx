import styled from 'styled-components';
import { Link } from 'react-router-dom';
import productData from '../../data/product.json';
import ProductGrid from '../../components/product/ProductGrid';

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
];

const AllCategoriesPage = () => {
  const allProducts = productData.products || [];

  return (
    <Container>
      <PageTitle>All Categories</PageTitle>
      <CategoryGrid>
        {categoryInfo.map((cat, idx) => {
          const products = allProducts.filter(
            p => p.category && p.category.toLowerCase() === cat.key
          ).slice(0, 4);

          return (
            <CategoryCard key={cat.key} $even={idx % 2 === 1}>
              <Banner style={{ backgroundImage: `url(${cat.banner})` }}>
                <BannerOverlay>
                  <CategoryName>
                    <Link to={`/category/${cat.key}`}>{cat.name}</Link>
                  </CategoryName>
                  <CategoryDesc>{cat.description}</CategoryDesc>
                </BannerOverlay>
              </Banner>
              <ProductsWrapper>
                <ProductGrid products={products} />
                <ViewAllLink to={`/category/${cat.key}`}>View all {cat.name} products →</ViewAllLink>
              </ProductsWrapper>
            </CategoryCard>
          );
        })}
      </CategoryGrid>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: 50px;
  font-size: 2.5rem;
  letter-spacing: 1px;
  color: #222;
`;

const CategoryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

const CategoryCard = styled.section`
  display: flex;
  flex-direction: ${({ $even }) => ($even ? 'row-reverse' : 'row')};
  gap: 40px;
  align-items: flex-start;
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

export default AllCategoriesPage;
