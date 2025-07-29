import styled from 'styled-components';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, wishlistIds = [], onToggleWishlist }) => {
  return (
    <Grid>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          wishlistIds={wishlistIds}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </Grid>
  );
};

const Grid = styled.div`
  width: 100%;
  min-width: 100%;
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  padding: 0 0;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`;

export default ProductGrid;