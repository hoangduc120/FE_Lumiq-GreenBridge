import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/layout";
import HomePage from "../mainPage/homePage";
import LoginPage from "../mainPage/Login";
import AboutUs from "../mainPage/AboutUs";
import Profile from "../mainPage/Profile";
import ViewAllProduct from "../mainPage/ViewAllProduct";
import ProductDetail from "../mainPage/ProductDetail";
import RatingAndReview from "../mainPage/RatingAndReview";
import Cart from "../mainPage/Cart";
import Payment from "../mainPage/Payment";
import PaymentResult from "../mainPage/PaymentResult";
import Membership from "../mainPage/Membership";
import Sell from "../mainPage/Sell";

import BlogEditor from "../mainPage/BlogEditor";
import BlogDetail from "../mainPage/BlogDetail";
import BlogList from "../mainPage/BlogList";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/viewall" element={<ViewAllProduct />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/rating-review" element={<RatingAndReview />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/momo-return" element={<PaymentResult />} />
        <Route path="/payment/vnpay-return" element={<PaymentResult />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/blog" element={<BlogEditor />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/blogs" element={<BlogList />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<Profile />}></Route>
    </Routes>
  );
}
