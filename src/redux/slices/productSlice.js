import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts } from '../../api/productApi';

// Async thunk để fetch sản phẩm
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ page = 1, limit = 6, sort = '', search = '' }, { rejectWithValue }) => {
        try {
            const response = await getAllProducts(page, limit, sort, search);
            console.log('Processed API response:', response);

            // Truy cập vào dữ liệu thực tế trong cấu trúc response
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return {
                products: [],
                totalPages: 0,
                currentPage: page
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải sản phẩm');
        }
    }
);

const initialState = {
    products: [],
    filteredProducts: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    currentPage: 1,
    totalPages: 1,
    priceRange: { min: 0, max: 1000000 },
    sort: '',
    search: ''
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setSort: (state, action) => {
            state.sort = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setPriceRange: (state, action) => {
            state.priceRange = action.payload;
            // Áp dụng bộ lọc giá cho sản phẩm hiện tại
            state.filteredProducts = state.products.filter(
                product => product.price >= action.payload.min && product.price <= action.payload.max
            );
        },
        resetFilters: (state) => {
            state.priceRange = { min: 0, max: 1000000 };
            state.filteredProducts = state.products;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log('Action payload in fulfilled:', action.payload);

                // Xử lý kết quả từ API
                state.products = action.payload.products || [];
                state.filteredProducts = action.payload.products || [];
                state.totalPages = action.payload.totalPages || 1;

                // Áp dụng lại bộ lọc giá nếu có
                if (state.priceRange.min > 0 || state.priceRange.max < 1000000) {
                    state.filteredProducts = state.products.filter(
                        product => product.price >= state.priceRange.min && product.price <= state.priceRange.max
                    );
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Đã xảy ra lỗi khi tải sản phẩm';
            });
    }
});

export const {
    setCurrentPage,
    setSort,
    setSearch,
    setPriceRange,
    resetFilters
} = productSlice.actions;

export default productSlice.reducer; 