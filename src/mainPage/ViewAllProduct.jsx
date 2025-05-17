import React, { useState, useEffect } from 'react'
import { Discover } from '../assets';
import ProductFilter from '../components/ProductFilter';
import Pagination from '../components/pagination';
import { Link } from 'react-router-dom';

const products = [
    {
        id: 1,
        name: "Ceramic pot",
        price: 20,
        seller: "Seller name",
        image: "../assets/images/Discover.png",
    },
    {
        id: 2,
        name: "Ceramic pot 2AB",
        price: 35,
        seller: "Seller name",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: 3,
        name: "Ceramic pot Indo",
        price: 126,
        seller: "Seller name",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: 4,
        name: "Ceramic pot",
        price: 20,
        seller: "Seller name",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: 5,
        name: "Ceramic pot 2AB",
        price: 35,
        seller: "Seller name",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: 6,
        name: "Ceramic pot Indo",
        price: 126,
        seller: "Seller name",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: 7,
        name: "Ceramic pot",
        price: 20,
        seller: "Seller name",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: 8,
        name: "Ceramic pot 2AB",
        price: 35,
        seller: "Seller name",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: 9,
        name: "Ceramic pot Indo",
        price: 126,
        seller: "Seller name",
        image: "/placeholder.svg?height=200&width=200",
    },
];

const ViewAllProduct = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredProducts, setFilteredProducts] = useState([...products]);
    const productsPerPage = 6;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Lấy sản phẩm cho trang hiện tại
    const getCurrentProducts = () => {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    };

    // Xử lý khi thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Bộ lọc giá
    const handlePriceFilter = (minPrice, maxPrice) => {
        const filtered = products.filter(
            product => product.price >= minPrice && product.price <= maxPrice
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header và Sort */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-gray-900">Category</span>
                </div>
                <div className="flex items-center">
                    <h1 className="text-2xl font-semibold text-green-500 mr-auto">Category</h1>
                    <span className="mr-2 text-gray-600">Sort by:</span>
                    <select className="border rounded-md px-2 py-1 text-sm">
                        <option>Most Popular</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Newest</option>
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filter */}
                <div className="w-full md:w-1/4 lg:w-1/5 ">
                    <ProductFilter />
                </div>

                {/* Product Grid */}
                <div className="w-full md:w-3/4 lg:w-4/5">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {getCurrentProducts().map((product) => (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="group"
                            >
                                <div className="overflow-hidden rounded-md bg-gray-100">
                                    <img
                                        src={Discover}
                                        alt={product.name}
                                        className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-green-500">{product.name}</h3>
                                    <div className="mt-1 flex items-center justify-between">
                                        <p className="text-lg font-medium text-green-500">${product.price}</p>
                                        <p className="text-sm text-gray-500">({product.seller})</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewAllProduct