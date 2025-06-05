import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import productDetailSlice from './slices/productDetailSlice';
import momoReducer from './slices/momoSlice';
import vnpayReducer from './slices/vnpaySlice';
import orderReducer from './slices/orderSlice';
import reviewReducer from './slices/reviewSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productReducer,
        productDetail: productDetailSlice,
        momo: momoReducer,
        vnpay: vnpayReducer,
        order: orderReducer,
        reviews: reviewReducer,
    },
});

export default store; 