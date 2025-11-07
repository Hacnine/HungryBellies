import React from 'react';
import restaurantImage from '../../assets/images/featured/restaurantImage.jpg';
import restaurantImage4 from '../../assets/images/featured/restaurantImage4.jpg';

const Gallery = () => {
  return (
    <section className='wrapper container mx-auto'>
        <h2 className="text-2xl text-center  mb-6">Our Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <img src={restaurantImage} alt="Restaurant Interior" className="w-full h-40 object-cover  shadow-md" />
          <img src={restaurantImage4} alt="Chef at Work" className="w-full h-40 object-cover  shadow-md" />

          <div className="w-full h-40 bg-gray-200  shadow-md flex items-center justify-center text-gray-500 font-semibold">
            + More
          </div>
        </div>
      </section>
  )
}

export default Gallery
