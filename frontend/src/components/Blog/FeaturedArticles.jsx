import React from 'react'

const FeaturedArticles = () => {
    return (
        <section className="mb-12 wrapper container mx-auto ">
            <h2 className="text-2xl  text-gray-800 mb-6 mt-20">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Featured Article 1 */}
                <div className="bg-white  shadow-md overflow-hidden rounded-t-3xl">
                    <img src='/blog/featuredImage1.jpg' alt="Featured 1" className="w-full h-48 object-cover" />
                    <div className="p-6">
                        <h3 className="text-xl  mb-2 text-gray-800">The Art of Culinary Mastery</h3>
                        <p className="text-gray-600 mb-4">Discover the techniques and skills that make great chefs truly exceptional.</p>
                        <button className="text-customred font-semibold">Read More →</button>
                    </div>
                </div>
                {/* Featured Article 2 */}
                <div className="bg-white  shadow-md overflow-hidden rounded-t-3xl ">
                    <img src="/blog/featuredImage2.jpg" alt="Featured 2" className="w-full h-48 object-cover" />
                    <div className="p-6">
                        <h3 className="text-xl  mb-2 text-gray-800">10 Ingredients You Need in Your Kitchen</h3>
                        <p className="text-gray-600 mb-4">Explore the essential ingredients that form the foundation of any great dish.</p>
                        <button className="text-customred font-semibold">Read More →</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturedArticles
