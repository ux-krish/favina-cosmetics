import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProductGrid from '../../components/product/ProductGrid';
import { useImageBasePath } from '../../context/ImagePathContext';
import productData from '../../data/product.json';

const WishlistPage = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const imageBasePath = useImageBasePath();

  useEffect(() => {
    // Use real products from productData
    const allProducts = productData.products || [];
    const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const filtered = allProducts.filter(p => wishlistIds.includes(p.id)).map(p => ({
      ...p,
      image: p.image && !p.image.includes('/') && p.image
        ? `${imageBasePath}/${p.image}`
        : p.image
    }));
    setWishlistProducts(filtered);
  }, [imageBasePath]);

  return (
    <Container>
      <h1>My Wishlist</h1>
      {wishlistProducts.length === 0 ? (
        <EmptyMsg>Your wishlist is empty.</EmptyMsg>
      ) : (
        <ProductGrid products={wishlistProducts} />
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const EmptyMsg = styled.div`
  text-align: center;
  color: #888;
  margin: 40px 0;
`;


export default WishlistPage;
