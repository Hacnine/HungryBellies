import React from 'react'

const ContactUs = () => {
    return (
        <section className="text-center px-4 py-8 bg-customred text-white wrapper shadow-md">
            <h2 className="text-2xl md:text-3xl  mb-4">We’d Love to Hear from You!</h2>
            <p className="text-lg md:text-xl mb-6">
                Reach out today to learn more about our services or make a reservation.
            </p>
            <button className="bg-white text-customred font-semibold py-2 px-6 rounded-full shadow-md hover:bg-gray-200">
                Contact Us
            </button>
        </section>
    )
}

export default ContactUs
