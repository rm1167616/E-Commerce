import React from 'react';
import './Style/CardTemplate2.css';

const CardTemplate2 = ({ product }) => {
  return (






    <div className="product-card">
      <div className="product-image-container">



        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
          }}
        />
        {product.isNew && <span className="product-badge">New</span>}
        {product.discount && <span className="discount-badge">-{product.discount}%</span>}
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>



        <div className="price-container">
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice}</span>
          )}
          <span className="current-price">${product.price}</span>
        </div>
        <div className="rating">
          {'★'.repeat(product.rating).padEnd(5, '☆')}
          <span className="review-count">({product.reviewCount})</span>
        </div>
        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
};

const ProductShowcase = () => {
  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      category: 'Audio',
      price: 79.99,
      originalPrice: 99.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      rating: 4,
      reviewCount: 128,
      isNew: true,
      discount: 20
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      category: 'Wearables',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      rating: 5,
      reviewCount: 256,
      isNew: false
    },
    {
      id: 3,
      name: 'Portable Bluetooth Speaker',
      category: 'Audio',
      price: 49.99,
      originalPrice: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb',
      rating: 3,
      reviewCount: 75,
      discount: 17
    },
    {
      id: 4,
      name: 'Wireless Charging Pad',
      category: 'Accessories',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90',
      rating: 4,
      reviewCount: 92,
      isNew: true
    },
    {
      id: 5,
      name: 'Ultra HD Action Camera',
      category: 'Cameras',
      price: 199.99,
      originalPrice: 249.99,
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
      rating: 5,
      reviewCount: 210,
      discount: 20
    },
    {
      id: 6,
      name: 'Ergonomic Wireless Mouse',
      category: 'Computer Accessories',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db',
      rating: 4,
      reviewCount: 68
    }
  ];

  return (
    <div className="product-showcase-page">
      <header className="showcase-header">
        <h1>Our Products</h1>
        <p>Discover our latest collection</p>
      </header>
      
      <div className="product-grid">
        {products.map(product => (
          <CardTemplate2 key={product.id} product={product} />
        ))}
      </div>
      
      <div className="pagination">
    
        <span className="page-number">1 of 3</span>
       
      </div>
    </div>
  );
};

export default ProductShowcase;