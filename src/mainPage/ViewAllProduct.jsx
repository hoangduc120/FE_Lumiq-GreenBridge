import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from 'use-debounce';
import Pagination from '../components/pagination';
import {
  fetchProducts,
  setCurrentPage,
  setSort,
  setSearch,
  setPriceRange,
  resetFilters,
} from '../redux/slices/productSlice';

const ViewAllProduct = () => {
  const dispatch = useDispatch();
  const {
    filteredProducts,
    status,
    error,
    currentPage,
    totalPages,
    search,
    sort,
    priceRange,
  } = useSelector((state) => state.products);

  const [debouncedSearch] = useDebounce(search, 500);
  const productsPerPage = 6;

  useEffect(() => {
    dispatch(fetchProducts({
      page: currentPage,
      limit: productsPerPage,
      sort,
      search: debouncedSearch,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    }));
  }, [dispatch, currentPage, sort, debouncedSearch, priceRange]);

  const handlePageChange = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePriceFilter = (minPrice, maxPrice) => {
    dispatch(setPriceRange({ min: minPrice, max: maxPrice }));
    dispatch(setCurrentPage(1)); // Reset về trang 1 khi thay đổi bộ lọc
  };

  const handleSearch = (e) => {
    dispatch(setSearch(e.target.value));
    dispatch(setCurrentPage(1));
  };

  const handleSortChange = (e) => {
    dispatch(setSort(e.target.value));
    dispatch(setCurrentPage(1));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(setSearch(''));
    dispatch(setSort(''));
    dispatch(setCurrentPage(1));
  };

  const isLoading = status === 'loading';
  const isError = status === 'failed';

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium">
            Trang chủ
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">Danh mục</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={handleSearch}
            className="w-full sm:w-72 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
          />
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-sm font-medium">Sắp xếp:</span>
            <select
              value={sort}
              onChange={handleSortChange}
              className="w-48 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
            >
              <option value="">Phổ biến nhất</option>
              <option value="priceAsc">Giá: Thấp đến cao</option>
              <option value="priceDesc">Giá: Cao đến thấp</option>
              <option value="nameAsc">Tên: A đến Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-full">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 text-lg">Đang tải sản phẩm...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl p-6 shadow-sm">
              <p className="font-semibold text-lg">{error}</p>
              <button
                onClick={() => dispatch(fetchProducts({
                  page: currentPage,
                  limit: productsPerPage,
                  sort,
                  search: debouncedSearch,
                  minPrice: priceRange.min,
                  maxPrice: priceRange.max,
                }))}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-600 bg-gray-100 rounded-xl p-6 shadow-sm">
              <p className="font-semibold text-lg">Không tìm thấy sản phẩm.</p>
              <p className="mt-2">Hãy thử xóa bộ lọc hoặc tìm kiếm sản phẩm khác.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.photos?.[0]?.url || 'https://via.placeholder.com/500'}
                      alt={product.name}
                      className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500';
                        console.warn(`Failed to load image for product ${product._id}`);
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-green-600 truncate">{product.name}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-lg font-medium text-green-600">{product.price.toLocaleString()}đ</p>
                      <p className="text-sm text-gray-500 truncate">{product.gardener?.email || 'Không xác định'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

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