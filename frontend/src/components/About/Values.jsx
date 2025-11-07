import React from 'react'

const Values = () => {
    return (
        <section className="bg-gray-100 p-8 rounded-md  mb-12 ">
            <h2 className="text-2xl  text-center text-gray-800 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto wrapper">
                <div className="text-center">
                    <h3 className="text-xl  text-gray-700">Quality Ingredients</h3>
                    <p className="text-gray-600">We source the finest ingredients to ensure that each dish is of the highest quality.</p>
                </div>
                <div className="text-center">
                    <h3 className="text-xl  text-gray-700">Sustainability</h3>
                    <p className="text-gray-600">Our commitment to sustainability means we prioritize local, eco-friendly practices.</p>
                </div>
                <div className="text-center">
                    <h3 className="text-xl  text-gray-700">Community</h3>
                    <p className="text-gray-600">We strive to be a positive force in our community by supporting local suppliers and causes.</p>
                </div>
            </div>
        </section>
    )
}

export default Values
