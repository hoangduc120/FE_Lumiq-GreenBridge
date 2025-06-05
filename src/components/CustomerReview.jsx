import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsByProductIdThunk, selectReviews, selectReviewsLoading } from "../redux/slices/reviewSlice";

const CustomerReview = ({ productId }) => {
    const dispatch = useDispatch();
    const reviews = useSelector(selectReviews);
    const loading = useSelector(selectReviewsLoading);

    useEffect(() => {
        dispatch(getReviewsByProductIdThunk({ productId, page: 1, limit: 10 }));
    }, [dispatch, productId]);

    if (loading) return <p>Đang tải...</p>;
    if (!reviews.length) return <p>Chưa có đánh giá nào</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Đánh giá sản phẩm</h2>
            {reviews.map((review) => (
                <div key={review._id} className="border-b py-2">
                    <p className="font-semibold">{review.author.name}</p>
                    <p>Rating: {review.rating}/5</p>
                    <p>{review.comment}</p>
                    <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default CustomerReview;