import React from 'react'

const ChefSpecialities = () => {
    return (
        <section className=" bg-chef p-8  shadow-md mb-12 ">
            <h2 className="text-2xl text-white text-center  mb-6">Chef's Specialities</h2>
            <p className="text-center text-white font-semibold font-poppins mb-6">
                Our chef’s hand-picked selections showcase the very best of our culinary skills and creativity.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
                {/* Speciality Cards */}
                <div className="bg-white p-6 shadow-md  w-full md:w-1/3">
                    <h3 className="text-lg font-semi ">Signature Ribeye Steak</h3>
                    <p className=" mt-2">
                        Perfectly seared, melt-in-your-mouth ribeye steak seasoned with our secret blend of spices.
                    </p>
                </div>
                <div className="bg-white p-6 shadow-md  w-full md:w-1/3">
                    <h3 className="text-lg font-semi ">Truffle Risotto</h3>
                    <p className=" mt-2">
                        Creamy risotto infused with truffle oil, topped with fresh herbs and parmesan.
                    </p>
                </div>
                <div className="bg-white p-6 shadow-md  w-full md:w-1/3">
                    <h3 className="text-lg font-semi ">Chocolate Lava Cake</h3>
                    <p className=" mt-2">
                        Decadent molten chocolate cake served with a scoop of vanilla bean ice cream.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ChefSpecialities
