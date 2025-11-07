import React from 'react'

const Categories = () => {
    return (
        <section className="bg-gray-100 py-8 px-6  wrapper  mb-12" container mx-auto >
            <h2 className="text-2xl  text-center text-gray-800 mb-6">Categories</h2>
            <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white px-6 py-3  shadow-md text-gray-700 hover:bg-customred hover:text-white rounded-full transition ">Recipes</button>
                <button className="bg-white px-6 py-3  shadow-md text-gray-700 hover:bg-customred hover:text-white transition rounded-full">Chef's Tips</button>
                <button className="bg-white px-6 py-3  shadow-md text-gray-700 hover:bg-customred hover:text-white transition rounded-full">Ingredients</button>
                <button className="bg-white px-6 py-3  shadow-md text-gray-700 hover:bg-customred hover:text-white transition rounded-full">News</button>
                {/* Add more categories as needed */}
            </div>
        </section>
    )
}

export default Categories
