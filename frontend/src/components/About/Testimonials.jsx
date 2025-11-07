import React from 'react'

const Testimonials = () => {
    return (
        <section className="mb-12 bg-customersay py-12 bg-cover wrapper ">
            <div className="container mx-auto">
            <h2 className="text-2xl  text-center text-gray-900  mb-6">What Our Customers Say</h2>
            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 shadow-lg ">
                    <p className="text-gray-600">"The best dining experience! The food was amazing and the staff were very friendly."</p>
                    <span className="block mt-4 font-semibold ">- Sarah L.</span>
                </div>
                <div className="bg-white p-6 shadow-lg ">
                    <p className="text-gray-600">"A cozy spot with delicious dishes and a lovely ambiance. Highly recommend!"</p>
                    <span className="block mt-4 font-semibold ">- Michael T.</span>
                </div>
                <div className="bg-white p-6 shadow-lg ">
                    <p className="text-gray-600">"Absolutely loved it! The flavors were unique and everything was fresh."</p>
                    <span className="block mt-4 font-semibold ">- Emily R.</span>
                </div>
            </div>
            </div>
            
        </section>
    )
}

export default Testimonials
