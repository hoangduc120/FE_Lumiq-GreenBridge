import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Rate, Spin, Empty, Card, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { getReviewsByProductIdThunk, selectReviews, selectReviewsLoading, selectTotalReviews } from "../redux/slices/reviewSlice";

const CustomerReview = ({ productId }) => {
    const dispatch = useDispatch();
    const reviews = useSelector(selectReviews);
    const loading = useSelector(selectReviewsLoading);
    const totalReviews = useSelector(selectTotalReviews);

    useEffect(() => {
        dispatch(getReviewsByProductIdThunk({ productId, page: 1, limit: 3 })); // Chỉ load 3 review đầu tiên
    }, [dispatch, productId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Spin tip="Đang tải đánh giá..." />
            </div>
        );
    }

    if (!reviews.length) {
        return (
            <div className="flex justify-center items-center py-10">
                <Empty description="Chưa có đánh giá nào" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Đánh giá sản phẩm</h2>
                <Link to={`/rating-review/${productId}`}>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        className="bg-green-500 hover:bg-green-600 border-green-500"
                    >
                        Xem tất cả ({totalReviews})
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                    <Card
                        key={review._id}
                        className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-lg text-gray-900">
                                    {review.author.name || review.author.email}
                                </p>
                                <Rate disabled defaultValue={review.rating} className="text-sm" />
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                            <p className="text-sm text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {totalReviews > 3 && (
                <div className="text-center mt-6">
                    <Link to={`/rating-review/${productId}`}>
                        <Button type="default" size="large">
                            Xem thêm {totalReviews - 3} đánh giá khác
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CustomerReview;