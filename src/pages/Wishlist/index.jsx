import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProductGrid from '../../components/product/ProductGrid';

const WishlistPage = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);

  useEffect(() => {
    // Simulate fetching all products (replace with real API in production)
    const allProducts = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
      price: Math.floor(Math.random() * 100) + 10,
      image: `https://via.placeholder.com/300?text=Product+${i + 1}`,
      category: ['Electronics', 'Clothing', 'Home', 'Books'][Math.floor(Math.random() * 4)],
    }));

    const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const filtered = allProducts.filter(p => wishlistIds.includes(p.id));
    setWishlistProducts(filtered);
  }, []);

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
