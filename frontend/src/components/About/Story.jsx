import React from 'react'
import chefImage from '../../assets/images/featured/chefImage.png'; 

const Story = () => {
  return (
    <section className="flex wrapper flex-col lg:flex-row items-center gap-8 mt-20 mb-12 container mx-auto">
    <img src={chefImage} alt="Our Chef" className="w-full h-full lg:w-80 shadow-md" />
    <div className="lg:w-1/2">
      <h2 className="text-2xl  text-gray-800 mb-4">Our Story</h2>
      <p className="text-gray-600 mb-6">
        Founded in November, 2024, our restaurant was built on the love for authentic, delicious food and a warm, welcoming environment. We pride ourselves on using only the freshest ingredients to craft meals that are both satisfying and memorable.
      </p>
      <p className="text-gray-600">
        From our humble beginnings to where we are today, our journey has been filled with passion, dedication, and a commitment to excellence. Join us and be a part of our story as we continue to bring joy to the table.
      </p>
    </div>
  </section>
  )
}

export default Story
