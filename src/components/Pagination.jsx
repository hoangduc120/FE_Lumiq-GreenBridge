import React from 'react'

const Pagination = ({
    currentPage = 1,
    totalPages = 10,
    onPageChange
}) => {
    // Tạo mảng số trang hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= 7) {
            // Nếu tổng số trang nhỏ, hiển thị tất cả
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Luôn hiển thị trang đầu
            pageNumbers.push(1);

            // Xử lý khoảng trang giữa
            if (currentPage <= 3) {
                // Gần trang đầu
                pageNumbers.push(2, 3, 4, "...");
            } else if (currentPage >= totalPages - 2) {
                // Gần trang cuối
                pageNumbers.push("...", totalPages - 3, totalPages - 2, totalPages - 1);
            } else {
                // Ở giữa
                pageNumbers.push("...", currentPage - 1, currentPage, currentPage + 1, "...");
            }

            // Luôn hiển thị trang cuối
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const handlePageChange = (page) => {
        // Chỉ gọi khi page là số và trong phạm vi hợp lệ
        if (typeof page === 'number' && page >= 1 && page <= totalPages && onPageChange) {
            onPageChange(page);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1 && onPageChange) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages && onPageChange) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="mt-12 flex items-center justify-between px-4">
            {/* Previous Button */}
            <button
                onClick={handlePrevious}
                className={`flex items-center gap-1 border border-gray-300 rounded-md px-3 py-1 text-sm hover:bg-gray-100 transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentPage === 1}
            >
                {/* Chevron Left SVG */}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                        className={`h-8 w-8 rounded-md text-sm transition ${page === currentPage
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : typeof page === 'number'
                                ? 'border border-gray-300 hover:bg-gray-100 cursor-pointer'
                                : 'border border-gray-300 cursor-default'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={handleNext}
                className={`flex items-center gap-1 border border-gray-300 rounded-md px-3 py-1 text-sm hover:bg-gray-100 transition ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentPage === totalPages}
            >
                Next
                {/* Chevron Right SVG */}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}

export default Pagination