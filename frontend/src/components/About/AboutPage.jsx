import React, { useEffect } from 'react'
import Hero from './Hero';
import Story from './Story';
import Values from './Values';
import Testimonials from './Testimonials';
import Gallery from './Gallery';
import { useLocation } from 'react-router-dom';

const About = () => {

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  return (
    <div className=" pb-8">
      <Hero />
      <Story />
      <Values />
      <Testimonials />
      <Gallery/>
    </div>
  );
};

export default About;
