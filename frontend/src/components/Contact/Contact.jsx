import React, { useEffect } from 'react'
import Hero from './Hero';
import ContactDetails from './ContactDetails';
import ContactForm from './ContactForm';
import Map from './Map';
import ContactUs from './ContactUs';
import { useLocation } from 'react-router-dom';

const Contact = () => {

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="pb-8">
      <Hero />
      <ContactDetails />
      <ContactForm />
      <Map />
      <ContactUs />
    </div>
  );
};

export default Contact;
