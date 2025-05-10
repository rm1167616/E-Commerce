import React, { useState, useRef } from 'react';
import { Card, Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/CategorySection.css';

const CategorySection = () => {
  // State for the banner image
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  
  // Sample product data (replace with your actual data)
  const products = [
    {
      id: 1,
      name: 'Smeg DCF02CR Retro Style',
      description: 'Drip Filter Coffee Machine - Home Appliances, New Arrivals',
      originalPrice: '29,999.00 EGP',
      discountedPrice: '27,999.00 EGP',
      discount: '7%'
    },
    {
      id: 2,
      name: 'Smeg MFF1CR',
      description: 'Automatic Milk - Home Appliances',
      originalPrice: '24,999.00 EGP',
      discountedPrice: '19,999.00 EGP',
      discount: '20%'
    },
    {
      id: 3,
      name: 'Smeg FAB28BCR5GA Retro Style Refrigerator',
      description: '28Lt - Home Appliances, New Arrivals',
      originalPrice: '229,999.00 EGP',
      discountedPrice: '199,999.00 EGP',
      discount: '28%'
    },
    {
      id: 4,
      name: 'Smeg TR410PI Victoria Aesthetic Gas Hob',
      description: '110 cm - Home Appliances, New Arrivals',
      price: '399,999.00 EGP'
    },
    {
      id: 5,
      name: 'Smeg K1F03CR Retro Style Kettle',
      description: '1.7 L Capacity - Cream - Home Appliances, New Arrivals',
      originalPrice: '24,999.00 EGP',
      discountedPrice: '19,999.00 EGP',
      discount: '20%'
    },
    {
      id: 6,
      name: 'Smeg HMFDICR Retro Style Electric Hand Mixer',
      description: 'Cream - Home Appliances, New Arrivals',
      price: '19,999.00 EGP'
    }
  ];

  // Handle banner image upload
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  // Group products into pairs for the carousel
  const productPairs = [];
  for (let i = 0; i < products.length; i += 2) {
    productPairs.push(products.slice(i, i + 2));
  }

  // Handle carousel navigation
  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };



  return (
    <Container className="my-5 category-section-container">
      {/* Fixed Banner at Top */}
      <div className="">
        {bannerPreview ? (
          <img 
            src={bannerPreview} 
            alt="Category Banner" 
            className="img-fluid rounded"
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
        ) : (
          <div className="banner-placeholder" style={{ 
            width: '100%', 
            height: '300px', 
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px'
          }}>
            <span>Category Banner</span>
          </div>
        )}
      </div>
      
      <section className="mb-5" style={{marginTop:'2%'}}>
      <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title">Category Name</h2>
          <a href="#view-more" className="view-more-link">VIEW MORE</a>
        </div>
        </section>
      {/* Product Cards */}
      <Row xs={1} md={2} lg={4} className="g-4 mb-5" style={{marginTop:'0%'}}>
        {products.slice(0, 4).map((product) => (
          <Col key={product.id}>
            <Card className="h-100 product-card">
              {/* Product Image Placeholder - Replace with actual product image */}
              <div 
                className="product-image-placeholder" 
                style={{
                  height: '200px',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span>Product Image</span>
              </div>
              
              <Card.Body>
                {product.discount && (
                  <span className="badge bg-danger mb-2">{product.discount}</span>
                )}
                <Card.Title className="product-title">{product.name}</Card.Title>
                <Card.Text className="text-muted small product-description">{product.description}</Card.Text>
                
                <div className="mt-3 product-prices">
                  {product.discountedPrice ? (
                    <>
                      <span className="text-danger fw-bold">{product.discountedPrice}</span>
                      <span className="text-decoration-line-through text-muted ms-2">{product.originalPrice}</span>
                    </>
                  ) : (
                    <span className="fw-bold">{product.price}</span>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
   
    </Container>
  );
};

export default CategorySection;