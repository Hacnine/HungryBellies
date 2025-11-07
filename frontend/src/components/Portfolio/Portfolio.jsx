import React, { useEffect } from 'react';
import Hero from './Hero';
import FeaturedDishes from './FeaturedDishes.jsx';
import ChefSpecialities from './ChefSpecialities.jsx';
import EventCatering from './EventCatering.jsx';
import Testimonials from './Testimonials.jsx';
import { useLocation } from 'react-router-dom';


const Portfolio = () => {

  
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="pb-8 ">
      <Hero />
      <FeaturedDishes />
      <ChefSpecialities />
      <EventCatering />
      <Testimonials />
    </div>
  );
};

export default Portfolio;
