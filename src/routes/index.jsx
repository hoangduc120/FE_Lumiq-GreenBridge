import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/layout";
import HomePage from "../mainPage/homePage";
import LoginPage from "../mainPage/Login";
import AboutUs from "../mainPage/AboutUs";
import ViewAllProduct from "../mainPage/ViewAllProduct";
import DetailProduct from "../mainPage/DetailProduct";
import RatingAndReview from "../mainPage/RatingAndReview";
import Cart from "../mainPage/Cart";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/viewall" element={<ViewAllProduct />} />
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/rating-review" element={<RatingAndReview />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
