import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiHeart, FiTruck, FiClock, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import CustomerReview from '../components/CustomerReview';
import { fetProductById, resetProductDetail } from '../redux/slices/productDetailSlice';
import {
    addToCart,
    buyNow,
    selectCartLoading,
    selectShouldNavigateToCart,
    clearNavigationFlag
} from '../redux/slices/cartSlice';


const ProductDetail = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux selectors
    const { product, status, error } = useSelector((state) => state.productDetail);
    const cartLoading = useSelector(selectCartLoading);
    const shouldNavigateToCart = useSelector(selectShouldNavigateToCart);

    // Xử lý images từ product
    const images = product?.image ? [product.image] : ['/placeholder.svg'];

    useEffect(() => {
        if (id) {
            dispatch(fetProductById(id));
        }

        // Cleanup khi component unmount
        return () => {
            dispatch(resetProductDetail());
        };
    }, [dispatch, id]);

    // Handle navigation to cart sau khi buy now
    useEffect(() => {
        if (shouldNavigateToCart) {
            dispatch(clearNavigationFlag());
            navigate('/cart');
            toast.success('Đã thêm sản phẩm vào giỏ hàng và chuyển đến trang thanh toán!');
        }
    }, [shouldNavigateToCart, navigate, dispatch]);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleAddToCart = async () => {
        if (!product?._id) {
            toast.error('Không tìm thấy thông tin sản phẩm');
            return;
        }

        try {
            await dispatch(addToCart({
                productId: product._id,
                quantity: 1
            })).unwrap();

            toast.success('Đã thêm sản phẩm vào giỏ hàng!');
        } catch (error) {
            toast.error(error || 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
        }
    };

    const handleBuyNow = async () => {
        if (!product?._id) {
            toast.error('Không tìm thấy thông tin sản phẩm');
            return;
        }

        try {
            await dispatch(buyNow({
                productId: product._id,
                quantity: 1
            })).unwrap();

            // Navigation sẽ được xử lý bởi useEffect khi shouldNavigateToCart thay đổi
        } catch (error) {
            toast.error(error || 'Có lỗi xảy ra khi mua sản phẩm');
        }
    };

    // Handle loading state
    if (status === 'loading') {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
                Đang tải thông tin sản phẩm...
            </div>
        );
    }

    // Handle error state
    if (status === 'failed') {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                Lỗi: {error || 'Không thể tải thông tin sản phẩm'}
            </div>
        );
    }

    // Handle no product found
    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
                Không tìm thấy sản phẩm
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 mb-6">
                    <Link to="/" className="text-gray-600 hover:text-gray-900">Trang chủ</Link>
                    <span className="text-gray-400">&gt;</span>
                    <Link to="/viewall" className="text-gray-600 hover:text-gray-900">Sản phẩm</Link>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-gray-900">{product.productName}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Hình ảnh sản phẩm */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={images[selectedImage]}
                                alt={product.productName}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Thumbnail images */}
                        {images.length > 1 && (
                            <div className="flex space-x-2">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-green-500' : 'border-gray-200'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.productName} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-gray-900">{product.productName}</h1>

                        <div className="flex items-center space-x-4">
                            <span className="text-3xl font-bold text-green-600">
                                {product.price?.toLocaleString()}đ
                            </span>
                            {product.stock && (
                                <span className="text-sm text-gray-500">
                                    Còn lại: {product.stock} sản phẩm
                                </span>
                            )}
                        </div>

                        {product.author && (
                            <div className="text-gray-600">
                                <span className="font-medium">Tác giả: </span>
                                <span>{product.author}</span>
                            </div>
                        )}

                        <p className="text-gray-600 leading-relaxed">
                            {product.description || 'Không có mô tả sản phẩm'}
                        </p>

                        {/* Thông tin giao hàng */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <FiTruck className="text-green-500" />
                                <span className="text-sm text-gray-600">Miễn phí giao hàng cho đơn từ 500.000đ</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FiClock className="text-green-500" />
                                <span className="text-sm text-gray-600">Giao hàng trong 2-3 ngày</span>
                            </div>
                        </div>

                        {/* Nút mua hàng và yêu thích */}
                        <div className="flex items-center gap-3 mt-6">
                            <button
                                onClick={handleBuyNow}
                                disabled={cartLoading || (product.stock && product.stock <= 0)}
                                className="px-5 py-3 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cartLoading ? 'Đang xử lý...' : 'Mua ngay'}
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={cartLoading || (product.stock && product.stock <= 0)}
                                className="px-4 py-3 flex items-center gap-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiShoppingCart />
                                {cartLoading ? 'Đang thêm...' : 'Thêm vào giỏ'}
                            </button>
                            <button
                                className={`p-3 rounded-md border ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-50`}
                                onClick={toggleFavorite}
                            >
                                <FiHeart className={isFavorite ? "fill-red-500" : ""} />
                            </button>
                        </div>

                        {product.stock && product.stock <= 0 && (
                            <p className="text-red-500 font-medium">Sản phẩm đã hết hàng</p>
                        )}
                    </div>
                </div>

                {/* Customer Reviews */}
                <div className="mt-16">
                    <CustomerReview />
                </div>
            </div>
        </>
    );
};

export default ProductDetail;