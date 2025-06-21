import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Rate, Modal, Form, Input, Button, message, Card, Avatar, Breadcrumb } from 'antd';
import { HomeOutlined, ProductOutlined } from '@ant-design/icons';
import ViewAllProduct from './ViewAllProduct';
import { fetProductById } from '../redux/slices/productDetailSlice';
import {
    createReviewThunk,
    getReviewsByProductIdThunk,
    selectReviews,
    selectReviewsLoading,
    selectReviewsError,
    selectTotalReviews,
    clearError
} from '../redux/slices/reviewSlice';

const { TextArea } = Input;

const RatingAndReview = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { productId } = useParams();

    const reviews = useSelector(selectReviews);
    const loading = useSelector(selectReviewsLoading);
    const error = useSelector(selectReviewsError);
    const totalReviews = useSelector(selectTotalReviews);
    const { product } = useSelector((state) => state.productDetail);

    // Tính toán rating trung bình
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    // Tính toán phân bố rating
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
        const count = reviews.filter(review => review.rating === rating).length;
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return { rating, count, percentage };
    });

    useEffect(() => {
        if (productId) {
            dispatch(getReviewsByProductIdThunk({ productId, page: 1, limit: 20 }));
            dispatch(fetProductById(productId));
        }
    }, [dispatch, productId]);

    useEffect(() => {
        if (error) {
            message.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            await dispatch(createReviewThunk({
                productId,
                reviewData: {
                    comment: values.comment,
                    rating: values.rating
                }
            })).unwrap();

            message.success('Đánh giá đã được tạo thành công!');
            setIsModalVisible(false);
            form.resetFields();

            // Refresh reviews
            dispatch(getReviewsByProductIdThunk({ productId, page: 1, limit: 20 }));
        } catch (error) {
            message.error(error || 'Có lỗi xảy ra khi tạo đánh giá');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!productId) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-20">
                    <h1 className="text-2xl font-bold text-gray-600 mb-4">Vui lòng chọn sản phẩm để xem đánh giá</h1>
                    <Link to="/viewall">
                        <Button type="primary" size="large">
                            Xem sản phẩm
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
                <Breadcrumb.Item>
                    <Link to="/">
                        <HomeOutlined />
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/viewall">
                        <ProductOutlined />
                        <span className="ml-1">Sản phẩm</span>
                    </Link>
                </Breadcrumb.Item>
                {product && (
                    <Breadcrumb.Item>
                        <Link to={`/product/${productId}`}>
                            {product.name}
                        </Link>
                    </Breadcrumb.Item>
                )}
                <Breadcrumb.Item>Đánh giá</Breadcrumb.Item>
            </Breadcrumb>

            {/* Product Info Card */}
            {product && (
                <Card className="mb-8 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <img
                            src={product.photos?.[0]?.url || 'https://via.placeholder.com/100'}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                            <p className="text-lg font-semibold text-green-600">
                                {product.price?.toLocaleString()}đ
                            </p>
                            {product.gardener && (
                                <p className="text-gray-600">
                                    Người trồng: {product.gardener.email}
                                </p>
                            )}
                        </div>
                        <Link to={`/product/${productId}`}>
                            <Button type="default">
                                Xem chi tiết sản phẩm
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}

            <div className="mb-8 rounded-lg border p-6">
                {/* Header với nút tạo đánh giá */}
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Tất cả đánh giá sản phẩm</h1>
                    <Button
                        type="primary"
                        onClick={showModal}
                        className="bg-green-500 hover:bg-green-600 border-green-500"
                    >
                        Viết đánh giá
                    </Button>
                </div>

                {/* Tổng quan đánh giá */}
                <div className="mb-8 flex flex-col items-center md:flex-row md:items-start">
                    <div className="mb-4 flex flex-col items-center md:mb-0 md:mr-8">
                        <div className="text-6xl font-bold text-green-600">{averageRating}</div>
                        <Rate disabled defaultValue={parseFloat(averageRating)} className="mb-2" />
                        <div className="rounded bg-green-500 px-3 py-1 text-sm text-white">
                            ({totalReviews} đánh giá)
                        </div>
                    </div>

                    {/* Rating Bars */}
                    <div className="flex-1">
                        {ratingDistribution.map(({ rating, percentage }) => (
                            <div key={rating} className="mb-2 flex items-center">
                                <span className="mr-3 w-3 text-sm">{rating}</span>
                                <div className="flex-1 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-4 rounded-full bg-green-500 transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="ml-3 text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danh sách đánh giá */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Đang tải đánh giá...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>Chưa có đánh giá nào cho sản phẩm này</p>
                            <p className="text-sm mt-1">Hãy là người đầu tiên đánh giá!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <Card key={review._id} className="shadow-sm">
                                <div className="flex items-start">
                                    <Avatar
                                        src={review.author.avatar}
                                        size={48}
                                        className="bg-green-500 mr-4"
                                    >
                                        {review.author.name ? review.author.name.charAt(0).toUpperCase() : 'U'}
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-medium text-lg">{review.author.name || review.author.email}</p>
                                                <Rate disabled defaultValue={review.rating} className="text-sm" />
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Modal tạo đánh giá */}
            <Modal
                title="Viết đánh giá"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="rating"
                        label="Đánh giá"
                        rules={[{ required: true, message: 'Vui lòng chọn số sao đánh giá!' }]}
                    >
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Nhận xét"
                        rules={[
                            { required: true, message: 'Vui lòng nhập nhận xét!' },
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <div className="flex justify-end space-x-2">
                            <Button onClick={handleCancel}>
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="bg-green-500 hover:bg-green-600 border-green-500"
                            >
                                Gửi đánh giá
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RatingAndReview;