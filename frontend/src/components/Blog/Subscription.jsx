import React from 'react'

const Subscription = () => {
    return (
        <section className=" wrapper text-center py-8  bg-customred text-white  shadow-md">
            <h2 className="text-2xl md:text-3xl  mb-4">Subscribe to Our Blog</h2>
            <p className="text-lg md:text-xl mb-6">
                Get the latest updates on recipes, cooking tips, and exclusive offers directly to your inbox.
            </p>
            <form className="flex flex-col md:flex-row items-center container mx-auto  justify-center gap-4">
                <input type="email" placeholder="Enter your email" className="p-3  text-gray-800 focus:outline-none rounded-2xl w-full md:w-auto" />
                <button className="bg-white text-customred rounded-2xl  py-2 px-6  shadow-md hover:bg-gray-200">
                    Subscribe
                </button>
            </form>
        </section>
    )
}

export default Subscription
