import React, { useEffect } from 'react'
import Hero from './Hero';
import FeaturedArticles from './FeaturedArticles';
import RecentPosts from './RecentPosts';
import Categories from './Categories';
import Subscription from './Subscription';
import { useLocation } from 'react-router-dom';



const Blog = () => {

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="pb-8">
      <Hero />
      <FeaturedArticles />
      <RecentPosts />
      <Categories />
      <Subscription />
    </div>
  );
};

export default Blog;
