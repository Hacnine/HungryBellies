import React from 'react'

const RecentPosts = () => {
    return (
        <section className="mb-12 wrapper container mx-auto ">
            <h2 className="text-2xl  text-gray-800 mb-6">Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                {/* Recent Post 1 */}
                <div className="bg-white  shadow-md overflow-hidden">
                    <img src="/blog/recentPostImage1.jpg" alt="Post 1" className="w-full h-40 object-cover" />
                    <div className="p-4">
                        <h3 className="text-lg  text-gray-800">5 Tips for Perfect Pasta</h3>
                        <p className="text-gray-600">Learn how to cook pasta like a pro with these simple tips.</p>
                        <button className="text-customred font-semibold mt-2">Read More →</button>
                    </div>
                </div>
                {/* Recent Post 2 */}
                <div className="bg-white  shadow-md overflow-hidden">
                    <img src={"/blog/recentPostImage2.jpg"} alt="Post 2" className="w-full h-40 object-cover" />
                    <div className="p-4">
                        <h3 className="text-lg  text-gray-800">How to Choose Fresh Ingredients</h3>
                        <p className="text-gray-600">Fresh ingredients make all the difference. Here’s how to pick them.</p>
                        <button className="text-customred font-semibold mt-2">Read More →</button>
                    </div>
                </div>
                {/* Add more recent posts as needed */}
            </div>
        </section>
    )
}

export default RecentPosts
