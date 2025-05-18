import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from 'use-debounce';
import ProductFilter from '../components/ProductFilter';
import Pagination from '../components/pagination';
import {
    fetchProducts,
    setCurrentPage,
    setSort,
    setSearch,
    setPriceRange,
    resetFilters
} from '../redux/slices/productSlice';

const ViewAllProduct = () => {
    const dispatch = useDispatch();
    const {
        products,
        filteredProducts,
        status,
        error,
        currentPage,
        totalPages,
        search,
        sort,
        priceRange
    } = useSelector(state => state.products);

    const [debouncedSearch] = useDebounce(search, 500);
    const productsPerPage = 6;

    // Fetch products when relevant parameters change
    useEffect(() => {
        dispatch(fetchProducts({
            page: currentPage,
            limit: productsPerPage,
            sort,
            search: debouncedSearch
        }));
    }, [dispatch, currentPage, sort, debouncedSearch]);
    useEffect(() => {
    }, [products, filteredProducts, status, error]);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        dispatch(setCurrentPage(pageNumber));
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Handle price filter
    const handlePriceFilter = (minPrice, maxPrice) => {
        dispatch(setPriceRange({ min: minPrice, max: maxPrice }));
    };

    // Handle search input
    const handleSearch = (e) => {
        dispatch(setSearch(e.target.value));
        dispatch(setCurrentPage(1));
    };

    // Handle sort change
    const handleSortChange = (e) => {
        dispatch(setSort(e.target.value));
        dispatch(setCurrentPage(1));
    };

    // Reset all filters
    const handleResetFilters = () => {
        dispatch(resetFilters());
        if (search) {
            dispatch(setSearch(''));
        }
        if (sort) {
            dispatch(setSort(''));
        }
    };

    const isLoading = status === 'loading';
    const isError = status === 'failed';

    return (
        <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
            {/* Header, Breadcrumbs, Search, and Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
                <div className="flex items-center space-x-3">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                        aria-label="Quay lại trang chủ"
                    >
                        Home
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 font-semibold">Category</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full sm:w-72 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
                        aria-label="Tìm kiếm sản phẩm theo tên"
                    />
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-sm font-medium">Arrange:</span>
                        <select
                            value={sort}
                            onChange={handleSortChange}
                            className="w-48 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                            aria-label="Sắp xếp sản phẩm"
                        >
                            <option value="">Most Popular</option>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                            <option value="nameAsc">Name: A to Z</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filter */}
                <div className="w-full lg:w-1/5 bg-white p-6 rounded-xl shadow-lg">
                    <ProductFilter onFilter={handlePriceFilter} />
                    {(search || sort || priceRange.min > 0 || priceRange.max < 1000000) && (
                        <button
                            onClick={handleResetFilters}
                            className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>

                {/* Product Grid */}
                <div className="w-full lg:w-4/5">
                    {isLoading ? (
                        <div className="text-center py-16">
                            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                            <p className="mt-4 text-gray-600 text-lg">Loading products...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl p-6 shadow-sm">
                            <p className="font-semibold text-lg">{error}</p>
                            <div className="mt-2 text-gray-700 text-sm">
                                <p>Status: {status}</p>
                                {error && <p className="mt-1">Error details: {error}</p>}
                            </div>
                            <button
                                onClick={() => dispatch(fetchProducts({
                                    page: currentPage,
                                    limit: productsPerPage,
                                    sort,
                                    search: debouncedSearch
                                }))}
                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Try again
                            </button>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12 text-gray-600 bg-gray-100 rounded-xl p-6 shadow-sm">
                            <p className="font-semibold text-lg">No products found.</p>
                            {products.length > 0 ? (
                                <p className="mt-2">Try clearing filters or searching for something else.</p>
                            ) : (
                                <div className="mt-3 text-left bg-white p-4 rounded-lg text-sm">
                                    <p className="font-medium text-red-500">Debug info:</p>
                                    <p>Status: {status}</p>
                                    <p>Total products in store: {products.length}</p>
                                    <p>Price filter: {priceRange.min} - {priceRange.max}</p>
                                    <p>Search term: "{search}"</p>
                                    <p>Sort option: {sort || 'None'}</p>
                                    <p>Current page: {currentPage}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                                    aria-label={`Xem chi tiết sản phẩm ${product.productName}`}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.productName}
                                            className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/500';
                                            }}
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-green-600 truncate">{product.productName}</h3>
                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-lg font-medium text-green-600">${product.price.toLocaleString()}</p>
                                            <p className="text-sm text-gray-500 truncate">({product.author})</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-10 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewAllProduct;