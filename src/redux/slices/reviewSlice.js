import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createReview, getReviewsByProductId, getReviewsByUserId, deleteReview } from '../../api/reviewApi';


export const createReviewThunk = createAsyncThunk(
    'reviews/createReview',
    async ({ productId, reviewData }, { rejectWithValue }) => {
        try {
            const response = await createReview(productId, reviewData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create review');
        }
    }
)

export const getReviewsByProductIdThunk = createAsyncThunk(
    'reviews/getReviewsByProductId',
    async ({ productId, page, limit }, { rejectWithValue }) => {
        try {
            const response = await getReviewsByProductId(productId, page, limit);
            console.log("2", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to get reviews');
        }
    }
)

export const getReviewsByUserIdThunk = createAsyncThunk(
    'reviews/getReviewsByUserId',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await getReviewsByUserId(page, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to get reviews');
        }
    }
)

export const deleteReviewThunk = createAsyncThunk(
    'reviews/deleteReview',
    async (reviewId, { rejectWithValue }) => {
        try {
            const response = await deleteReview(reviewId);
            return { reviewId, ...response };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete review');
        }
    }
)

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [],
        totalPages: 1,
        currentPage: 1,
        totalReviews: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReviewThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReviewThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews.push(action.payload);
            })
            .addCase(createReviewThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getReviewsByProductIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReviewsByProductIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalReviews = action.payload.totalReviews;
            })
            .addCase(getReviewsByProductIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getReviewsByUserIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReviewsByUserIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalReviews = action.payload.totalReviews;
            })
            .addCase(getReviewsByUserIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteReviewThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReviewThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = state.reviews.filter(review => review._id !== action.payload.reviewId);
            })
            .addCase(deleteReviewThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { clearError } = reviewSlice.actions;
export const selectReviews = (state) => state.reviews.reviews;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsError = (state) => state.reviews.error;
export const selectTotalPages = (state) => state.reviews.totalPages;
export const selectCurrentPage = (state) => state.reviews.currentPage;
export const selectTotalReviews = (state) => state.reviews.totalReviews;
export default reviewSlice.reducer;