import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductById } from "../../api/productApi";


export const fetProductById = createAsyncThunk(
    'productDetail/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await getProductById(id);
            return response; // Backend trả về trực tiếp đối tượng sản phẩm
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải thông tin sản phẩm');
        }
    }
);
const initialState = {
    product: null,
    status: 'idle',
    error: null
};

const productDetailSlice = createSlice({
    name: 'productDetail',
    initialState,
    reducers: {
        resetProductDetail: (state) => {
            state.product = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetProductById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetProductById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.product = action.payload;
            })
            .addCase(fetProductById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetProductDetail } = productDetailSlice.actions;
export default productDetailSlice.reducer;
