import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiTruck, FiClock, FiShoppingCart } from 'react-icons/fi';
import CustomerReview from '../components/CustomerReview';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../redux/slices/cartSlice';
import { fetProductById, resetProductDetail } from '../redux/slices/productDetailSlice';
import { message } from 'antd';

const ProductDetail = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { product, status, error } = useSelector((state) => state.productDetail)

    // Mảng hình ảnh mặc định nếu không có từ API
    const images = product?.images || [product?.image || '/placeholder.svg'];

    useEffect(() => {
        dispatch(fetProductById(id))
        return () => {
            dispatch(resetProductDetail())
        }
    }, [dispatch, id]);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleAddToCart = () => {
        if (product) {
            dispatch(
                cartActions.addToCart({
                    id: product._id,
                    name: product.productName,
                    price: product.price,
                    image: product.image || images[0]
                })
            )
            message.success(`${product.productName} added to cart successfully!`);
        }
    };

    const handleBuyNow = () => {
        if (product) {
            dispatch(
                cartActions.addToCart({
                    id: product._id,
                    name: product.productName,
                    price: product.price,
                    image: product.image || images[0]
                })
            );
            message.success(`${product.productName} added to cart successfully!`);
            navigate('/cart');
        }
    };

    // Handle loading state
    if (status === 'loading') {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
                Loading product details...
            </div>
        );
    }

    // Handle error state
    if (status === 'failed') {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                Error: {error || 'Failed to load product'}
            </div>
        );
    }

    // Handle no product found
    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
                Product not found
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 mb-6">
                    <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                    <span className="text-gray-400">&gt;</span>
                    <Link to="/viewall" className="text-gray-600 hover:text-gray-900">Category</Link>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-gray-900">{product.productName}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Phần hình ảnh sản phẩm */}
                    <div className="flex gap-4">
                        {/* Thumbnails */}
                        <div className="flex flex-col gap-4">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer overflow-hidden rounded border-2 ${selectedImage === index ? "border-green-500" : "border-gray-200"}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img
                                        src={image || "/placeholder.svg"}
                                        alt={`Product thumbnail ${index + 1}`}
                                        className="h-20 w-20 object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 overflow-hidden rounded">
                            <img
                                src={images[selectedImage] || "/placeholder.svg"}
                                alt={product.productName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Phần thông tin sản phẩm */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">{product.productName}</h1>

                        {/* Thời gian còn lại */}
                        <div className="flex items-center text-sm text-gray-600">
                            <FiClock className="mr-1" />
                            <span>Time left {product.countdownTime || "Limited time"}</span>
                        </div>

                        {/* Giá sản phẩm */}
                        <div className="text-2xl font-bold">{product.price.toLocaleString()}đ</div>

                        {/* Tác giả */}
                        <div className="text-gray-700">
                            <span className="font-medium">Tác giả:</span> {product.author}
                        </div>

                        {/* Mô tả ngắn */}
                        <p className="text-gray-700">{product.description}</p>

                        {/* Nút mua hàng và yêu thích */}
                        <div className="flex items-center gap-3 mt-6">
                            <button
                                onClick={handleBuyNow}
                                className="px-5 py-3 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition cursor-pointer"
                            >
                                Buy now
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="px-4 py-3 flex items-center gap-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition cursor-pointer"
                            >
                                <FiShoppingCart />
                                Add to cart
                            </button>
                            <button
                                className={`p-3 rounded-md border ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-50`}
                                onClick={toggleFavorite}
                            >
                                <FiHeart className={isFavorite ? "fill-red-500" : ""} />
                            </button>
                        </div>

                        {/* Thông tin vận chuyển */}
                        <div className="mt-8 border rounded-md">
                            <div className="flex items-center p-4 border-b">
                                <FiTruck className="text-xl mr-4" />
                                <div>
                                    <div className="font-medium">Shipping</div>
                                    <div className="text-sm text-gray-600">{product.shipping || "Free shipping"}</div>
                                </div>
                            </div>
                            <div className="flex items-center p-4">
                                <FiClock className="text-xl mr-4" />
                                <div>
                                    <div className="font-medium">Delivery</div>
                                    <div className="text-sm text-gray-600">{product.delivery || "2-3 business days"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thông tin chi tiết sản phẩm */}
                <div className="mt-12 border rounded-md p-6">
                    <h2 className="text-xl font-bold mb-4">About this item</h2>
                    <div className="space-y-4">
                        {product.about && Array.isArray(product.about)
                            ? product.about.map((paragraph, index) => (
                                <p key={index} className="text-gray-700">{paragraph}</p>
                            ))
                            : <p className="text-gray-700">{product.description || "No description available"}</p>
                        }
                    </div>
                </div>
                <div className='mt-12'>
                    <CustomerReview />
                </div>
            </div>
        </>
    );
}

export default ProductDetail