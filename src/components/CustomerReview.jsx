import React from 'react'
import { Rate } from 'antd';
import { Link } from 'react-router-dom';

const CustomerReview = () => {
    return (
        <div className="rounded border p-6">
            <div className="mb-4 flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                    <img
                        src="/placeholder.svg?height=48&width=48"
                        alt="Kolf Khawaja"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div>
                    <p className="font-medium">Kolf Khawaja</p>
                    <div className="flex items-center">
                        <div className='flex'>
                            <Rate disabled defaultValue={4} />
                        </div>
                        <span className="ml-2 text-sm text-gray-500">(150 Reviews)</span>
                    </div>
                </div>
            </div>
            <p className="text-gray-700">
                I'm really happy with my Banyan Tree for Desk!
                <div className="mt-4">
                    <Link to="/rating-review">
                        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer">
                            Contact
                        </button>
                    </Link>
                </div>
            </p>
        </div>
    );
}

export default CustomerReview