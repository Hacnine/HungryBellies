import React from 'react'

import clientLogo1 from '../../assets/images/clients/client-1.png'; // Replace with actual image paths
import clientLogo2 from '../../assets/images/clients/client-2.png';
import clientLogo3 from '../../assets/images/clients/client-3.png';
import clientLogo4 from '../../assets/images/clients/client-4.png';
const ClientLogos = () => {
  return (
    <section className="bg-gray-100 py-8 px-4  mt-20 mb-12  wrapper">
        <h2 className="text-2xl  text-center text-black mb-6">Trusted By</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <img src={clientLogo1} alt="Client 1" className="h-16 w-16 md:h-20 md:w-20 object-contain" />
          <img src={clientLogo2} alt="Client 2" className="h-16 w-16 md:h-20 md:w-20 object-contain" />
          <img src={clientLogo3} alt="Client 3" className="h-16 w-16 md:h-20 md:w-20 object-contain" />
          <img src={clientLogo4} alt="Client 4" className="h-16 w-16 md:h-20 md:w-20 object-contain" />
          {/* Add more logos as needed */}
        </div>
      </section>
  )
}

export default ClientLogos
