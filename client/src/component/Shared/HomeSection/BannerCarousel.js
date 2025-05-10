import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Container } from 'react-bootstrap';
import '../Style/BannerCarousel.css'; // We'll create this CSS file

function BannerCarousel() {
  return (
    <Container fluid className="px-0">
      <Carousel controls={false} indicators={false} fade>
        {/* First Slide */}
        <Carousel.Item interval={500}>
          <div className="echotech-banner">
            <div className="banner-content">
              <h1 className="banner-title">E-COMMERCE</h1>
              <p className="banner-subtitle">YOUR SMART CHOICE</p>
              <button className="banner-button">Shop Now</button>
            </div>
          </div>
        </Carousel.Item>

        {/* Second Slide */}
        <Carousel.Item interval={500}>
          <div className="echotech-banner banner-2">
            <div className="banner-content">
              <h2 className="banner-promo">Limited Time Offer</h2>
              <h1 className="banner-title">Up to 50% Off</h1>
              <p className="banner-subtitle">On All Electronics</p>
              <button className="banner-button">Discover Deals</button>
            </div>
          </div>
        </Carousel.Item>

        {/* Third Slide */}
        <Carousel.Item interval={500}>
          <div className="echotech-banner banner-3">
            <div className="banner-content">
              <h1 className="banner-title">New Arrivals</h1>
              <p className="banner-subtitle">Latest Tech Gadgets</p>
              <button className="banner-button">Explore Now</button>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
}

export default BannerCarousel;