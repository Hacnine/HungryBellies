import React from 'react'

const Testimonials = () => {
    return (
        <section className="mb-12 wrapper bg-client py-12">
            <div className="container mx-auto">
            <h2 className="text-2xl  text-white mb-6 text-center">Client Testimonials</h2>
            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-white p-6 shadow-lg ">
                    <p className="text-black">"The team made our wedding day truly special. Every dish was delightful!"</p>
                    <span className="block mt-4  text-black">- Emily & John</span>
                </div>
                {/* Testimonial 2 */}
                <div className="bg-white p-6 shadow-lg ">
                    <p className="text-black">"Exceptional service and delicious food for our corporate event."</p>
                    <span className="block mt-4  text-black">- GreenTech Ltd.</span>
                </div>
                {/* Testimonial 3 */}
                <div className="bg-white p-6 shadow-lg ">
                    <p className="text-black">"Outstanding catering services for our charity gala. Highly recommend!"</p>
                    <span className="block mt-4  text-black">- Hope Foundation</span>
                </div>
                {/* Add more testimonials as needed */}
            </div>
            </div>
        </section>
    )
}

export default Testimonials
