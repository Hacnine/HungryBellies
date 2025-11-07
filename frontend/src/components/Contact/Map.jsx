import React from 'react'

const Map = () => {
    return (
        <section className="mb-12 wrapper container wrapper">
            <h2 className="text-2xl  text-gray-800 mb-6 text-center">Find Us Here</h2>
            <div className="w-full h-72 md:h-96 bg-gray-200  overflow-hidden shadow-md">
                {/* Embedded Google Map */}
                <iframe
                    title="Google Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d950666.7120266843!2d38.02807838697523!3d21.447246043857348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d01fb1137e59%3A0xe059579737b118db!2sJeddah%20Saudi%20Arabia!5e0!3m2!1sen!2sbd!4v1730951309872!5m2!1sen!2sbd"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                ></iframe>
            </div>
        </section>
    )
}

export default Map
