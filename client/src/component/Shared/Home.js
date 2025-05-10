
  import React, { Component } from 'react'
  import { Container } from 'react-bootstrap';

import BannerCarousel from './HomeSection/BannerCarousel';
import ProductsCarousel from './HomeSection/ProductsCarousel';
import CardTemplate2 from '../Template1/Cards/Sections/CardTemplate2';


  
  const Home = () => {
    
      return (
       <Container>
    <div className="flex flex-row"
   >
    
     <BannerCarousel/>
     <ProductsCarousel/>
     <CardTemplate2/>
 

    </div>
    </Container>
      );
    
  };
  
  export default Home;
  