import React, { useState, useRef, useEffect } from 'react'

const ProductFilter = () => {
    const [priceRange, setPriceRange] = useState([20, 85]);
    const [isDragging, setIsDragging] = useState(false);
    const [activeThumb, setActiveThumb] = useState(null); // 0: left thumb, 1: right thumb
    const [isPriceOpen, setIsPriceOpen] = useState(true);

    // Giá trị tạm thời khi kéo thanh trượt
    const [tempPriceRange, setTempPriceRange] = useState([20, 85]);

    // Ref cho thanh trượt
    const sliderRef = useRef(null);
    const MIN_PRICE = 20;
    const MAX_PRICE = 85;
    const RANGE = MAX_PRICE - MIN_PRICE;

    // Xử lý khi kéo chuột di chuyển
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging && activeThumb !== null && sliderRef.current) {
                const rect = sliderRef.current.getBoundingClientRect();
                const position = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
                const value = Math.round(MIN_PRICE + position * RANGE);

                updatePriceValue(activeThumb, value);
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setActiveThumb(null);
                // Cập nhật giá trị chính từ giá trị tạm thời
                setPriceRange([...tempPriceRange]);
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, activeThumb, tempPriceRange]);

    // Xử lý sự kiện touch move
    const handleTouchMove = (e) => {
        if (isDragging && activeThumb !== null && sliderRef.current && e.touches[0]) {
            const rect = sliderRef.current.getBoundingClientRect();
            const position = Math.min(Math.max(0, (e.touches[0].clientX - rect.left) / rect.width), 1);
            const value = Math.round(MIN_PRICE + position * RANGE);

            updatePriceValue(activeThumb, value);
        }
    };

    // Cập nhật giá trị dựa vào vị trí đã kéo hoặc nhấp
    const updatePriceValue = (index, value) => {
        // Kiểm tra và đảm bảo giá trị hợp lệ (min không vượt quá max và ngược lại)
        let newValue = value;

        if (index === 0 && newValue > tempPriceRange[1]) {
            newValue = tempPriceRange[1];
        } else if (index === 1 && newValue < tempPriceRange[0]) {
            newValue = tempPriceRange[0];
        }

        const newRange = [...tempPriceRange];
        newRange[index] = newValue;

        setTempPriceRange(newRange);
        setPriceRange(newRange);
    };

    const handlePriceChange = (e) => {
        const value = Number.parseInt(e.target.value);
        const index = Number.parseInt(e.target.dataset.index || "0");
        updatePriceValue(index, value);
    };

    // Xử lý khi bắt đầu kéo
    const handleDragStart = (index) => (e) => {
        e.preventDefault();
        setIsDragging(true);
        setActiveThumb(index);
    };

    // Xử lý khi click vào thanh trượt
    const handleSliderClick = (e) => {
        if (isDragging) return;

        const sliderRect = sliderRef.current.getBoundingClientRect();
        const clickPosition = (e.clientX - sliderRect.left) / sliderRect.width;

        // Tính giá trị tương ứng trong khoảng [MIN_PRICE, MAX_PRICE]
        const value = Math.round(MIN_PRICE + clickPosition * RANGE);

        // Xác định nút tròn nào di chuyển (min hoặc max)
        const distanceToMin = Math.abs(((priceRange[0] - MIN_PRICE) / RANGE) - clickPosition);
        const distanceToMax = Math.abs(((priceRange[1] - MIN_PRICE) / RANGE) - clickPosition);

        if (distanceToMin <= distanceToMax) {
            updatePriceValue(0, value);
        } else {
            updatePriceValue(1, value);
        }
    };

    // Áp dụng bộ lọc
    const applyFilter = () => {
        console.log("Applying filter with price range:", priceRange);
        // Có thể gọi callback hoặc dispatch action ở đây
    };

    // Tính toán phần trăm để hiển thị thanh trượt
    const getPercentage = (value) => {
        return ((value - MIN_PRICE) / RANGE) * 100;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-green-500">Filter</h3>
                <button className="p-2 hover:bg-gray-100 rounded-md transition">
                    {/* SlidersHorizontal SVG */}
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6h9m-9 6h9m-9 6h9M3 6h3m-3 6h3m-3 6h3" />
                    </svg>
                </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium text-green-500">Price</h4>
                    <button
                        className="p-1 hover:bg-gray-100 rounded-md transition"
                        onClick={() => setIsPriceOpen(!isPriceOpen)}
                    >
                        {/* ChevronUp SVG */}
                        <svg
                            className={`h-4 w-4 transition-transform ${isPriceOpen ? "" : "rotate-180"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                </div>

                {isPriceOpen && (
                    <div className="mt-4 space-y-6">
                        {/* Hiển thị giá trị hiện tại */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">${priceRange[0]}</span>
                            <span className="text-sm font-medium text-gray-700">${priceRange[1]}</span>
                        </div>

                        {/* Thanh trượt */}
                        <div
                            ref={sliderRef}
                            className="relative h-6 px-2 py-2 cursor-pointer"
                            onClick={handleSliderClick}
                        >
                            {/* Thanh nền */}
                            <div className="absolute top-3 h-2 w-full rounded-full bg-gray-200"></div>

                            {/* Thanh màu */}
                            <div
                                className={`absolute top-3 h-2 rounded-full bg-green-500 ${isDragging ? 'transition-none' : 'transition-all duration-150'}`}
                                style={{
                                    left: `${getPercentage(priceRange[0])}%`,
                                    right: `${100 - getPercentage(priceRange[1])}%`,
                                }}
                            ></div>

                            {/* Nút kéo bên trái */}
                            <div
                                className={`absolute top-3 h-6 w-6 -ml-3 -mt-2 flex items-center justify-center cursor-grab rounded-full bg-white border-2 border-green-500 shadow-md hover:shadow-lg ${activeThumb === 0 && isDragging ? 'cursor-grabbing scale-110 border-green-600' : ''} transition-transform`}
                                style={{ left: `${getPercentage(priceRange[0])}%` }}
                                onMouseDown={handleDragStart(0)}
                                onTouchStart={handleDragStart(0)}
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>

                            {/* Nút kéo bên phải */}
                            <div
                                className={`absolute top-3 h-6 w-6 -ml-3 -mt-2 flex items-center justify-center cursor-grab rounded-full bg-white border-2 border-green-500 shadow-md hover:shadow-lg ${activeThumb === 1 && isDragging ? 'cursor-grabbing scale-110 border-green-600' : ''} transition-transform`}
                                style={{ left: `${getPercentage(priceRange[1])}%` }}
                                onMouseDown={handleDragStart(1)}
                                onTouchStart={handleDragStart(1)}
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                        </div>

                        {/* Nút áp dụng */}
                        <button
                            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                            onClick={applyFilter}
                        >
                            Apply Filter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductFilter