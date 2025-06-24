import styled from 'styled-components';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  return (
    <Grid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
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
  gap: 20px;
  padding: 20px 0;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default ProductGrid;