import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import productDetailSlice from './slices/productDetailSlice';
import momoReducer from './slices/momoSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productReducer,
        productDetail: productDetailSlice,
        momo: momoReducer,
    },
});

export default store; 