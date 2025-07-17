import React from 'react';
import Carousel from '../components/Carousel';
import HomeProductsTeaser from '../components/HomeProductsTeaser';
import About from '../components/About';

function HomePage() {
  return (
    <>
      <Carousel />
      <HomeProductsTeaser />
      <About />
    </>
  );
}

export default HomePage;
