import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/layout";
import HomePage from "../mainPage/homePage";
import LoginPage from "../mainPage/Login";
import AboutUs from "../mainPage/AboutUs";
import Profile from "../mainPage/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<Profile />}></Route>
    </Routes>
  );
}
