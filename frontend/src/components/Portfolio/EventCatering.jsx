import React from 'react'
import portfolioImage3 from '../../assets/images/portfolio/portfolioImage3.jpg';
import portfolioImage2 from '../../assets/images/portfolio/portfolioImage2.jpg';
const EventCatering = () => {
    return (
        <section className="mb-12 wrapper">
            <h2 className="text-2xl font-semi  mb-6 text-center">Event Catering</h2>
            <p className="text-center  font-poppins font-semibold mb-10">
                Make your special occasions unforgettable with our tailored catering services.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 wrapper  container mx-auto ">
                <div className="bg-cover bg-center h-60  shadow-md" style={{ backgroundImage: `url(${portfolioImage2})` }}>
                    <div className="bg-black bg-opacity-30  w-full h-full flex items-center justify-center text-white text-lg font-semi opacity-0 hover:opacity-100 transition-opacity">
                        Wedding Catering
                    </div>
                </div>
                <div className="bg-cover bg-center h-60  shadow-md" style={{ backgroundImage: `url(${portfolioImage3})` }}>
                    <div className="bg-black bg-opacity-30  w-full h-full flex items-center justify-center text-white text-lg font-semi opacity-0 hover:opacity-100 transition-opacity">
                        Corporate Events
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EventCatering
