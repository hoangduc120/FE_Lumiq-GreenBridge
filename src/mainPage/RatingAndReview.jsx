import React from 'react'
import ViewAllProduct from './ViewAllProduct';
import { Rate } from 'antd';

const RatingAndReview = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 rounded-lg border p-6">
                {/* Seller Profile */}
                <div className="mb-8 flex flex-col items-center md:flex-row md:items-start">
                    <div className="mb-4 flex flex-col items-center md:mb-0 md:mr-8">
                        <div className="mb-2 h-24 w-24 overflow-hidden rounded-full">
                            <img
                                src="/placeholder.svg?height=96&width=96"
                                alt="Alex Ng"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <h1 className="text-2xl font-bold">Alex Ng</h1>
                        <p className="text-green-500">alex@gmail.com</p>

                        <div className="mt-4 flex flex-col items-center">
                            <div className="text-6xl font-bold">4.8</div>
                            <div className="mb-1 rounded bg-green-500 px-2 py-0.5 text-xs text-white">(125 reviews)</div>
                        </div>
                    </div>

                    {/* Rating Bars */}
                    <div className="flex-1">
                        <div className="mb-1 flex items-center">
                            <span className="mr-2 w-3">5</span>
                            <div className="flex-1 overflow-hidden rounded-full bg-gray-200">
                                <div className="h-5 w-[90%] rounded-full bg-blue-500"></div>
                            </div>
                        </div>
                        <div className="mb-1 flex items-center">
                            <span className="mr-2 w-3">4</span>
                            <div className="flex-1 overflow-hidden rounded-full bg-gray-200">
                                <div className="h-5 w-[75%] rounded-full bg-blue-500"></div>
                            </div>
                        </div>
                        <div className="mb-1 flex items-center">
                            <span className="mr-2 w-3">3</span>
                            <div className="flex-1 overflow-hidden rounded-full bg-gray-200">
                                <div className="h-5 w-0 rounded-full bg-blue-500"></div>
                            </div>
                        </div>
                        <div className="mb-1 flex items-center">
                            <span className="mr-2 w-3">2</span>
                            <div className="flex-1 overflow-hidden rounded-full bg-gray-200">
                                <div className="h-5 w-0 rounded-full bg-blue-500"></div>
                            </div>
                        </div>
                        <div className="mb-1 flex items-center">
                            <span className="mr-2 w-3">1</span>
                            <div className="flex-1 overflow-hidden rounded-full bg-gray-200">
                                <div className="h-5 w-[10%] rounded-full bg-blue-500"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="space-y-6">
                    {/* Review 1 */}
                    <div className="relative border-b pb-6">
                        <div className="flex items-start">
                            <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                                <img
                                    src="/placeholder.svg?height=48&width=48"
                                    alt="John Smith"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">John Smith</p>
                                        <div className="flex text-yellow-400">
                                            <span className="mr-1">★</span>
                                            <span className="mr-1">★</span>
                                            <span className="mr-1">★</span>
                                            <span className="mr-1">★</span>
                                            <span>★</span>
                                        </div>
                                    </div>
                                    <button className="rounded-full p-1 hover:bg-gray-100">
                                        {/* MoreVertical SVG */}
                                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="mt-2 text-gray-700">
                                    Alex is a highly skilled horticulturist
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Review 2 */}
                    <div className="relative">
                        <div className="flex items-start">
                            <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                                <img
                                    src="/placeholder.svg?height=48&width=48"
                                    alt="Ronlie"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Ronlie</p>
                                        <div className="flex text-yellow-400">
                                            <span className="mr-1">★</span>
                                            <span className="mr-1">★</span>
                                            <span className="mr-1">★</span>
                                            <span className="mr-1">★</span>
                                            <span className="text-gray-300">★</span>
                                        </div>
                                    </div>
                                    <button className="rounded-full p-1 hover:bg-gray-100">
                                        {/* MoreVertical SVG */}
                                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="mt-2 text-gray-700">
                                    Great insights on plant maintenance and design! Alex's advice is practical and effective, though I'd
                                    love more advanced tips.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Show More Button */}
                    <div className="flex justify-center pt-4">
                        <button className="flex items-center text-gray-500 hover:text-gray-700">
                            <span className="mr-1">Show more</span>
                            {/* ChevronDown SVG */}
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Sort By */}
                <div className="mt-6 flex justify-end">
                    <div className="flex items-center text-sm">
                        <span className="mr-2 text-gray-600">Sort by:</span>
                        <select className="rounded border border-gray-300 px-2 py-1">
                            <option>Most Popular</option>
                            <option>Newest</option>
                            <option>Highest Rating</option>
                            <option>Lowest Rating</option>
                        </select>
                    </div>
                </div>
            </div>
            <ViewAllProduct />
        </div>
    );
}
export default RatingAndReview