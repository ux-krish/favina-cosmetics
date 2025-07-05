// (Delete this file)
import { Link } from 'react-router-dom';
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

const AllCategoriesPage = () => {
  const allProducts = productData.products || [];

  // Only show categories that have at least one product
  const filteredCategories = categoryInfo.filter(cat =>
    allProducts.some(
      p => p.category && p.category.toLowerCase() === cat.key
    )
  );

  return (
    <PageWrapper>
      {filteredCategories.map(cat => {
        const products = allProducts.filter(
          p => p.category && p.category.toLowerCase() === cat.key
        );
        return (
          <CategorySection key={cat.key}>
            <Banner style={{ backgroundImage: `url(${cat.banner})` }}>
              <BannerOverlay>
                <CategoryTitle>
                  <Link to={`/category/${cat.key}`}>{cat.name}</Link>
                </CategoryTitle>
                <CategoryDesc>{cat.description}</CategoryDesc>
              </BannerOverlay>
            </Banner>
            <ProductsWrapper>
              <ProductGrid products={products} />
            </ProductsWrapper>
          </CategorySection>
        );
      })}
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 0 40px 0;
`;

const CategorySection = styled.section`
  margin-bottom: 60px;
`;

const Banner = styled.div`
  width: 100vw;
  min-width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  height: 320px;
  background-size: cover;
  background-position: center;
  border-radius: 0;
  margin-bottom: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
`;

const BannerOverlay = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px 60px 32px 60px;
  color: #fff;
  @media (max-width: 900px) {
    padding: 24px 18px;
  }
`;

const CategoryTitle = styled.h2`
  font-size: 2.5rem;
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
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  color: #f5f5f5;
`;

const ProductsWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px 0 20px;
`;

export default AllCategoriesPage;
