import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductById } from "../../api/productApi";



export const fetProductById = createAsyncThunk(
    "productDetail/fetchProductById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getProductById(id);
            // Response có cấu trúc: { message, status, data: { product }, options }
            if (response && response.data && response.data.product) {
                return response.data.product;
            } else {
                return rejectWithValue("Dữ liệu sản phẩm không đúng định dạng");
            }
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch product");
        }
    }
)

const initialState = {
    product: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const productDetailSlice = createSlice({
    name: "productDetail",
    initialState,
    reducers: {
        resetProductDetail: (state) => {
            state.product = null;
            state.status = 'idle';
            state.error = null;
        },
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
            })
    }
})

export const { resetProductDetail } = productDetailSlice.actions;
export default productDetailSlice.reducer;
