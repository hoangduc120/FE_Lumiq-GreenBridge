import instance from "./axios";

export const createReview = async (productId, reviewData) => {
    try {
        const response = await instance.post("/review", {
            productId, ...reviewData
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to create review");
    }
}

export const getReviewsByProductId = async (productId, page = 1, limit = 10) => {
    try {
        const response = await instance.get(`/review/product/${productId}`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to get reviews");
    }
}

export const getReviewsByUserId = async (page = 1, limit = 10) => {
    try {
        const response = await instance.get("/review/user", {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to get reviews");
    }
}

export const deleteReview = async (reviewId) => {
    try {
        const response = await instance.delete(`/review/${reviewId}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to delete review");
    }
}