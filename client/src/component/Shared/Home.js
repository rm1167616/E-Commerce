
  import React, { Component } from 'react'
  import { Container } from 'react-bootstrap';

import BannerCarousel from './HomeSection/BannerCarousel';
import ProductsCarousel from './HomeSection/ProductsCarousel';
import CategorySection from './HomeSection/CategorySection';
import CardTemplate2 from '../Template1/Cards/Sections/CardTemplate2';


  
  const Home = () => {
    
      return (
       <Container>
    <div className="flex flex-row"
   >
    
     <BannerCarousel/>
     <ProductsCarousel/>
     <CategorySection/>
 

    </div>
    </Container>
      );
    
  };
  
  export default Home;
  