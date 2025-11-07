import React from 'react'

const ClientExperience = () => {
    return (
        <section className="bg-gray-100 p-8 wrapper  mb-12">
            <h2 className="text-2xl  text-center text-black mb-6">Client Experiences</h2>
            <p className="text-center text-black mb-6">
                Our clients have shared their memorable experiences with us, and we’re proud to have been a part of their celebrations.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
                {/* Experience Cards */}
                <div className="bg-white p-6 shadow-md  w-full md:w-1/3">
                    <h3 className="text-lg  text-black">Wedding of Emily & John</h3>
                    <p className="text-black mt-2">
                        A beautiful outdoor wedding with a custom menu to match the romantic setting.
                    </p>
                </div>
                <div className="bg-white p-6 shadow-md  w-full md:w-1/3">
                    <h3 className="text-lg  text-black">Corporate Gala for GreenTech Ltd.</h3>
                    <p className="text-black mt-2">
                        An upscale corporate dinner featuring our finest gourmet dishes for GreenTech’s partners.
                    </p>
                </div>
                <div className="bg-white p-6 shadow-md  w-full md:w-1/3">
                    <h3 className="text-lg  text-black">Charity Gala for Hope Foundation</h3>
                    <p className="text-black mt-2">
                        Supporting a noble cause with delicious catering that impressed all attendees.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ClientExperience
