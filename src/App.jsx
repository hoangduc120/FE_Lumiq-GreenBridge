import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./mainPage/homePage";
import LoginPage from "./mainPage/Login";
import { Slide, ToastContainer } from "react-toastify";
import AboutUs from "./mainPage/AboutUs";
import AppRoutes from "./routes";

function App() {
  return (
    <div>
      <AppRoutes />
      <ToastContainer
        transition={Slide}
        autoClose={2000}
        newestOnTop={true}
        pauseOnHover={true}
        pauseOnFocusLoss={false}
        limit={5}
      />
    </div>
  );
}

export default App;
