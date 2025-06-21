import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts } from '../../api/productApi';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ page = 1, limit = 6, sort = '', search = '' }, { rejectWithValue }) => {
        try {
            const response = await getAllProducts(page, limit, sort, search);
            console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải sản phẩm');
        }
    }
);

const initialState = {
    products: [],
    filteredProducts: [],
    status: 'idle',
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
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
            state.filteredProducts = state.products.filter(
                product => product.price >= action.payload.min && product.price <= action.payload.max
            );
        },
        resetFilters: (state) => {
            state.priceRange = { min: 0, max: 1000000 };
            state.sort = '';
            state.search = '';
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
                state.products = action.payload.products || [];
                state.filteredProducts = action.payload.products || [];
                state.totalPages = action.payload.totalPages || 1;
                state.currentPage = action.payload.currentPage || 1;
                state.totalProducts = action.payload.totalProducts || 0;

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