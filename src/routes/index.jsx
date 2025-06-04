import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/layout";
import AdminLayout from "../components/admin/AdminLayout";
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
import BlogEditor from "../blog/BlogEditor";
import BlogDetail from "../blog/BlogDetail";
import BlogList from "../blog/BlogList";
import ManageBlog from "../blog/ManageBlog";
import EditBlog from "../blog/EditBlog";
import Sell from "../mainPage/Sell";
import { gardenerRoutes } from "../gardener";
import ManagePackage from "../mainPage/admin/ManagePackage";
import ManageVoucher from "../mainPage/admin/ManageVoucher";
import RegisterPackage from "../mainPage/RegisterPackage";
import GardenerRegister from "../mainPage/GardenerRegister";
import AddCategory from "../mainPage/admin/AddCategory";
import Chatbox from "../mainPage/chatbox";
import ManageGardenerProfile from "../mainPage/admin/ManageGardenerProfile";

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
        <Route path="/blog/edit/:id" element={<EditBlog />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/manage-blog" element={<ManageBlog />} />
        <Route path="/package/:id" element={<RegisterPackage />} />
        <Route path="/gardener-register" element={<GardenerRegister />} />
        {gardenerRoutes}
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<ManagePackage />} />
        <Route path="manage-package" element={<ManagePackage />} />
        <Route path="manage-voucher" element={<ManageVoucher />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="manage-gardener-profile" element={<ManageGardenerProfile />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/chatbox" element={<Chatbox />} />
    </Routes>
  );
}
