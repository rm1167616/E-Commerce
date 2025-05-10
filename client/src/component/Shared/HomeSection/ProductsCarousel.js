import React from 'react';
import { Carousel, Container, Card, Row, Col } from 'react-bootstrap';
import '../Style/ProductsCarousel.css';

const ProductsCarousel = () => {
  // Sample product data with placeholder images
  const newArrivals = [
    {
      id: 1,
      title: "Sony HT-A5000",
      category: "Home Appliances",
      price: "23,999,00 EGP",
      originalPrice: "64,999,00 EGP",
      discount: "33%",
      imageUrl: "https://via.placeholder.com/300x200?text=Sony+HT-A5000"
    },
    {
      id: 2,
      title: "Sony HT A7000",
      category: "Home",
      price: "4,999,00 EGP",
      originalPrice: "44,999,00 EGP",
      discount: "43%",
      imageUrl: "https://via.placeholder.com/300x200?text=Sony+HT+A7000"
    },
    {
      id: 3,
      title: "Sony SA-SWS",
      category: "Speakers",
      price: "8,999,00 EGP",
      originalPrice: "12,999,00 EGP",
      discount: "32%",
      imageUrl: "https://via.placeholder.com/300x200?text=Sony+SA-SWS"
    },
    {
      id: 4,
      title: "Sony SA-SWS",
      category: "Speakers",
      price: "6,999,00 EGP",
      originalPrice: "9,999,00 EGP",
      discount: "9%",
      imageUrl: "https://via.placeholder.com/300x200?text=Sony+SA-SWS"
    },
    {
      id: 5,
      title: "DJI Osmo",
      category: "New Arrivals",
      price: "5,999,00 EGP",
      originalPrice: "7,999,00 EGP",
      discount: "12%",
      imageUrl: "https://via.placeholder.com/300x200?text=DJI+Osmo"
    },
    {
      id: 6,
      title: "Wireless Headphones",
      category: "Mobile",
      price: "1,999,00 EGP",
      originalPrice: "2,999,00 EGP",
      discount: "15%",
      imageUrl: "https://via.placeholder.com/300x200?text=Wireless"
    },
  ];

  const topOffers = [...newArrivals]; 

  const CustomPrevButton = ({ onClick }) => (
    <button className="carousel-control-prev" onClick={onClick}>
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    </button>
  );

  const CustomNextButton = ({ onClick }) => (
    <button className="carousel-control-next" onClick={onClick}>
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
    </button>
  );

  return (
    <Container className="products-carousel-container">
      {/* New Arrivals Section */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title">New Arrivals</h2>
          <a href="#view-more" className="view-more-link">VIEW MORE</a>
        </div>
        
        <Carousel 
          indicators={false}
          prevIcon={<CustomPrevButton />}
          nextIcon={<CustomNextButton />}
          interval={null}
        >
          {[...Array(Math.ceil(newArrivals.length / 4.5))].map((_, slideIndex) => (
            <Carousel.Item key={`new-arrivals-${slideIndex}`}>
              <Row className="g-4">
                {newArrivals.slice(slideIndex * 5, (slideIndex * 5) + 4).map((product) => (
                  <Col key={product.id} lg={3} md={4} sm={12} className="d-flex">
                    <Card className="product-card flex-grow-1">
                      <div className="product-image-container">
                        <img 
                          src={product.imageUrl} 
                          alt={product.title}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = 'product-image-placeholder';
                          }}
                        />
                        <div className="discount-badge">{product.discount}</div>
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="product-title">{product.title}</Card.Title>
                        <Card.Subtitle className="product-category mb-2">{product.category}</Card.Subtitle>
                        <div className="price-container mt-auto">
                          <span className="current-price">{product.price}</span>
                          <span className="original-price">{product.originalPrice}</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Top Offers Section */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title">Top Offers</h2>
          <a href="#view-more" className="view-more-link">VIEW MORE</a>
        </div>
        
        <Carousel 
          indicators={false}
          prevIcon={<CustomPrevButton />}
          nextIcon={<CustomNextButton />}
          interval={null}
        >
          {[...Array(Math.ceil(topOffers.length / 4.5))].map((_, slideIndex) => (
            <Carousel.Item key={`top-offers-${slideIndex}`}>
              <Row className="g-4">
                {topOffers.slice(slideIndex * 5, (slideIndex * 5) + 4).map((product) => (
                  <Col key={product.id} lg={3} md={4} sm={6} className="d-flex">
                    <Card className="product-card flex-grow-1">
                      <div className="product-image-container">
                        <img 
                          src={product.imageUrl} 
                          alt={product.title}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = 'product-image-placeholder';
                          }}
                        />
                        <div className="discount-badge">{product.discount}</div>
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="product-title">{product.title}</Card.Title>
                        <Card.Subtitle className="product-category mb-2">{product.category}</Card.Subtitle>
                        <div className="price-container mt-auto">
                          <span className="current-price">{product.price}</span>
                          <span className="original-price">{product.originalPrice}</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>
    </Container>
  );
};

export default ProductsCarousel;