import React from 'react'

const Testimonials = () => {
  return (
    <section className='wrapper bg-client py-12'>
        <div className="container mx-auto">
        <h2 className="text-2xl font-semi text-center text-white  mb-6">What Our Clients Say</h2>
        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-8  wrapper">
          <div className="bg-white p-6 shadow-lg ">
            <p className="">"Exceptional service and exquisite dishes – truly unforgettable!"</p>
            <span className="block mt-4 font-semi ">- Alice M.</span>
          </div>
          <div className="bg-white p-6 shadow-lg ">
            <p className="">"The catering for our wedding was flawless. Highly recommend!"</p>
            <span className="block mt-4 font-semi ">- David W.</span>
          </div>
          <div className="bg-white p-6 shadow-lg ">
            <p className="">"Every dish was beautifully presented and tasted amazing."</p>
            <span className="block mt-4 font- ">- Sarah P.</span>
          </div>
        </div>
        </div>
      </section>
  )
}

export default Testimonials
