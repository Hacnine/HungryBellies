import React from 'react'
import portfolioImage1 from '../../assets/images/portfolio/portfolioImage1.jpg';
import portfolioImage2 from '../../assets/images/portfolio/portfolioImage2.jpg';
import portfolioImage3 from '../../assets/images/portfolio/portfolioImage3.jpg';

const FeaturedDishes = () => {
    return (
        <section className="mt-20 mb-12 wrapper  container mx-auto ">
            <h2 className="text-2xl font-  mb-6">Featured Dishes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative">
                    <img src={portfolioImage1} alt="Dish 1" className="w-full h-60 object-cover  shadow-md" />
                    <div className="absolute inset-0 bg-black bg-opacity-30  flex items-center justify-center text-white text-lg font- opacity-0 hover:opacity-100 transition-opacity">
                        Spicy Grilled Chicken
                    </div>
                </div>
                <div className="relative">
                    <img src={portfolioImage2} alt="Dish 2" className="w-full h-60 object-cover  shadow-md" />
                    <div className="absolute inset-0 bg-black bg-opacity-30  flex items-center justify-center text-white text-lg font- opacity-0 hover:opacity-100 transition-opacity">
                        Seafood Paella
                    </div>
                </div>
                <div className="relative">
                    <img src={portfolioImage3} alt="Dish 3" className="w-full h-60 object-cover  shadow-md" />
                    <div className="absolute inset-0 bg-black bg-opacity-30  flex items-center justify-center text-white text-lg font- opacity-0 hover:opacity-100 transition-opacity">
                        Gourmet Pasta
                    </div>
                </div>
            </div>
        </section>

    )
}

export default FeaturedDishes
