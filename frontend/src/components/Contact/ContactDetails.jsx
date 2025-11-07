import React from 'react'

const ContactDetails = () => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20  container mx-auto wrapper mb-12">
            <div className="text-center bg-yellow-500 p-6  shadow-md">
                <h3 className="text-xl  ttext-gray-200">Our Location</h3>
                <p className="ttext-gray-200 mt-2">123 Main Street, Jeddah, Saudi Arabia</p>
            </div>
            <div className="text-center bg-yellow-500 p-6  shadow-md">
                <h3 className="text-xl  ttext-gray-200">Phone</h3>
                <p className="ttext-gray-200 mt-2">+966 123 456 789</p>
                <p className="ttext-gray-200">+966 987 654 321</p>
            </div>
            <div className="text-center bg-yellow-500 p-6  shadow-md">
                <h3 className="text-xl  ttext-gray-200">Email</h3>
                <p className="ttext-gray-200 mt-2">contact@yourrestaurant.com</p>
            </div>
        </section>
    )
}

export default ContactDetails
