import React, { useEffect } from 'react'
import Hero from './Hero';
import ClientLogos from './ClientLogos';
import Testimonials from './Testimonials';
import ClientExperience from './ClientExperience';
import Contact from './Contact';
import { useLocation } from 'react-router-dom';


const Clients = () => {

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="pb-8 ">
      <Hero />
      <ClientLogos />
      <Testimonials />
      <ClientExperience />
      <Contact />
    </div>
  );
};

export default Clients;
