import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiTruck, FiClock, FiShoppingCart } from 'react-icons/fi';
import CustomerReview from '../components/CustomerReview';
import { useDispatch } from 'react-redux';
import { cartActions } from '../redux/slices/cartSlice';
import { message } from 'antd';

const images = [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
];

const productData = {
    id: 1,
    name: "Banyan tree for desk",
    price: 20,
    author: "Seller name",
    countdownTime: "44 20h (Sat, 02:39 PM)",
    description: "PlayStation 5",
    features: ["Chất liệu gốm sứ", "Không thấm nước", "Thiết kế hiện đại", "Nhiều kích thước"],
    specifications: {
        "Kích thước": "15 x 20 cm",
        "Chất liệu": "Gốm sứ cao cấp",
        "Xuất xứ": "Việt Nam",
        "Bảo hành": "12 tháng"
    },
    shipping: "Rs. 100 per order",
    delivery: "Estimated between Thu, Jan 4 and Fri, Jan 12",
    about: [
        "The Banyan Tree for Desk is a great choice to add a touch of nature and freshness to your workspace."
    ],
    image: "/placeholder.svg?height=400&width=400"
};

const ProductDetail = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [product, setProduct] = useState(productData);
    const [isFavorite, setIsFavorite] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(`Fetching product with id: ${id}`);
    }, [id]);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleAddToCart = () => {
        dispatch(
            cartActions.addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || images[0]
            })
        );
        message.success(`${product.name} đã được thêm vào giỏ hàng!`);
    };

    const handleBuyNow = () => {
        // Thêm sản phẩm vào giỏ hàng
        dispatch(
            cartActions.addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || images[0]
            })
        );
        // Chuyển đến trang giỏ hàng
        navigate('/cart');
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 mb-6">
                    <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                    <span className="text-gray-400">&gt;</span>
                    <Link to="/viewall" className="text-gray-600 hover:text-gray-900">Category</Link>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-gray-900">{product.name}</span>
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
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Phần thông tin sản phẩm */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">{product.name}</h1>

                        {/* Thời gian còn lại */}
                        <div className="flex items-center text-sm text-gray-600">
                            <FiClock className="mr-1" />
                            <span>Time left {product.countdownTime}</span>
                        </div>

                        {/* Giá sản phẩm */}
                        <div className="text-2xl font-bold">{product.price}$</div>

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
                                    <div className="text-sm text-gray-600">{product.shipping}</div>
                                </div>
                            </div>
                            <div className="flex items-center p-4">
                                <FiClock className="text-xl mr-4" />
                                <div>
                                    <div className="font-medium">Delivery</div>
                                    <div className="text-sm text-gray-600">{product.delivery}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thông tin chi tiết sản phẩm */}
                <div className="mt-12 border rounded-md p-6">
                    <h2 className="text-xl font-bold mb-4">About this item</h2>
                    <div className="space-y-4">
                        {product.about.map((paragraph, index) => (
                            <p key={index} className="text-gray-700">{paragraph}</p>
                        ))}
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