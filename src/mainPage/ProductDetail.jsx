import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiHeart, FiTruck, FiClock, FiShoppingCart } from 'react-icons/fi';
import { Rate, Button, Form, Input, Card, message } from 'antd';
import { toast } from 'react-toastify';
import CustomerReview from '../components/CustomerReview';
import { fetProductById, resetProductDetail } from '../redux/slices/productDetailSlice';
import {
    addToCart,
    buyNow,
    selectCartLoading,
    selectShouldNavigateToCart,
    clearNavigationFlag,
} from '../redux/slices/cartSlice';
import {
    createReviewThunk,
    getReviewsByProductIdThunk,
    selectReviewsLoading,
    clearError
} from '../redux/slices/reviewSlice';

const { TextArea } = Input;

const ProductDetail = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { product, status, error } = useSelector((state) => state.productDetail);
    const cartLoading = useSelector(selectCartLoading);
    const shouldNavigateToCart = useSelector(selectShouldNavigateToCart);
    const reviewLoading = useSelector(selectReviewsLoading);

    const images = product?.photos?.length > 0
        ? product.photos.map((photo) => photo.url)
        : ['https://via.placeholder.com/500'];

    useEffect(() => {
        if (id) {
            dispatch(fetProductById(id));
        }
        return () => {
            dispatch(resetProductDetail());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (shouldNavigateToCart) {
            dispatch(clearNavigationFlag());
            navigate('/cart');
            toast.success('Đã thêm sản phẩm vào giỏ hàng và chuyển đến trang thanh toán!');
        }
    }, [shouldNavigateToCart, navigate, dispatch]);

    const handleCreateReview = async (values) => {
        if (!product?._id) {
            message.error('Không tìm thấy thông tin sản phẩm');
            return;
        }
        try {
            await dispatch(createReviewThunk({
                productId: product._id,
                reviewData: {
                    comment: values.comment,
                    rating: values.rating
                }
            })).unwrap();

            message.success('Đánh giá đã được tạo thành công!');
            reviewForm.resetFields();
            setShowReviewForm(false);

            // Refresh reviews
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            message.error(error || 'Có lỗi xảy ra khi tạo đánh giá');
        }
    };

    const toggleReviewForm = () => {
        setShowReviewForm(!showReviewForm);
        if (!showReviewForm) {
            reviewForm.resetFields();
        }
    };

    const toggleFavorite = async () => {
        setIsFavorite(!isFavorite);
        toast.info(isFavorite ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
    };

    const handleAddToCart = async () => {
        if (!product?._id) {
            toast.error('Không tìm thấy thông tin sản phẩm');
            return;
        }
        try {
            await dispatch(addToCart({
                productId: product._id,
                quantity: 1,
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
                quantity: 1,
            })).unwrap();
        } catch (error) {
            toast.error(error || 'Có lỗi xảy ra khi mua sản phẩm');
        }
    };

    if (status === 'loading') {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
                Đang tải thông tin sản phẩm...
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                Lỗi: {error || 'Không thể tải thông tin sản phẩm'}
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
                Không tìm thấy sản phẩm
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center space-x-2 mb-6">
                <Link to="/" className="text-gray-600 hover:text-gray-900">Trang chủ</Link>
                <span className="text-gray-400">&gt;</span>
                <Link to="/viewall" className="text-gray-600 hover:text-gray-900">Sản phẩm</Link>
                <span className="text-gray-400">&gt;</span>
                <span className="text-gray-900">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/500';
                                console.warn(`Failed to load image for product ${product._id}`);
                            }}
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="flex space-x-2">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-green-500' : 'border-gray-200'}`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-3xl font-bold text-green-600">
                            {product.price?.toLocaleString()}đ
                        </span>
                        {product.unitsAvailable !== undefined && (
                            <span className="text-sm text-gray-500">
                                Còn lại: {product.unitsAvailable} sản phẩm
                            </span>
                        )}
                    </div>
                    {product.gardener && (
                        <div className="text-gray-600">
                            <span className="font-medium">Người trồng: </span>
                            <span>{product.gardener.name || product.gardener.email}</span>
                        </div>
                    )}
                    {product.categories?.length > 0 && (
                        <div className="text-gray-600">
                            <span className="font-medium">Danh mục: </span>
                            <span>{product.categories.map((category) => category.name).join(', ')}</span>
                        </div>
                    )}
                    {product.plantedAt && (
                        <div className="text-gray-600">
                            <span className="font-medium">Ngày trồng: </span>
                            <span>{new Date(product.plantedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    )}
                    <p className="text-gray-600 leading-relaxed">
                        {product.description || 'Không có mô tả sản phẩm'}
                    </p>
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
                    <div className="flex items-center gap-3 mt-6">
                        <button
                            onClick={handleBuyNow}
                            disabled={cartLoading || product.unitsAvailable <= 0}
                            className="px-5 py-3 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cartLoading ? 'Đang xử lý...' : 'Mua ngay'}
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={cartLoading || product.unitsAvailable <= 0}
                            className="px-4 py-3 flex items-center gap-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiShoppingCart />
                            {cartLoading ? 'Đang thêm...' : 'Thêm vào giỏ'}
                        </button>
                        <button
                            className={`p-3 rounded-md border ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-50`}
                            onClick={toggleFavorite}
                        >
                            <FiHeart className={isFavorite ? 'fill-red-500' : ''} />
                        </button>
                    </div>
                    {product.unitsAvailable <= 0 && (
                        <p className="text-red-500 font-medium">Sản phẩm đã hết hàng</p>
                    )}
                </div>
            </div>

            {/* Review Section */}
            <div className="mt-16 space-y-8">
                {/* Create Review Form */}
                <Card title="Đánh giá sản phẩm" className="shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-gray-600">Chia sẻ trải nghiệm của bạn về sản phẩm này</p>
                        <Button
                            type="primary"
                            onClick={toggleReviewForm}
                            className="bg-green-500 hover:bg-green-600 border-green-500"
                        >
                            {showReviewForm ? 'Hủy' : 'Viết đánh giá'}
                        </Button>
                    </div>

                    {showReviewForm && (
                        <Form
                            form={reviewForm}
                            layout="vertical"
                            onFinish={handleCreateReview}
                            className="mt-4"
                        >
                            <Form.Item
                                name="rating"
                                label="Đánh giá của bạn"
                                rules={[{ required: true, message: 'Vui lòng chọn số sao đánh giá!' }]}
                            >
                                <Rate className="text-2xl" />
                            </Form.Item>

                            <Form.Item
                                name="comment"
                                label="Nhận xét chi tiết"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập nhận xét!' },
                                ]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Chia sẻ trải nghiệm của bạn về chất lượng, độ tươi ngon, đóng gói..."
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>

                            <Form.Item className="mb-0">
                                <div className="flex gap-3">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={reviewLoading}
                                        className="bg-green-500 hover:bg-green-600 border-green-500"
                                    >
                                        {reviewLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                                    </Button>
                                    <Button onClick={toggleReviewForm}>
                                        Hủy
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    )}
                </Card>

                {/* Existing Reviews */}
                <CustomerReview productId={product._id} />
            </div>
        </div>
    );
};

export default ProductDetail;