import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { getUserById } from "../../api/userApi";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../api/authApi";
import { MdLogout } from "react-icons/md";
import {
  fetchCart,
  selectCartItems,
  selectCartUniqueItemsCount,
  selectCartIsFetched,
} from "../../redux/slices/cartSlice";
import axiosInstance from "../../api/axios";
// import Avatar from "../../assets/images/avatar.png";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Sử dụng Redux state cho cart
  const cartItems = useSelector(selectCartItems);
  const totalItemsCount = useSelector(selectCartUniqueItemsCount);
  const isFetched = useSelector(selectCartIsFetched);

  // Check if user is logged in - memoize để tránh re-render liên tục
  const storeUser = useMemo(() => localStorage.getItem("user"), []);
  const isLoggedIn = useMemo(() => !!storeUser, [storeUser]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenu, setIsMenu] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      const params = new URLSearchParams(location.search);
      const accessToken = params.get("accessToken");

      let userData = null;

      // Handle Google login callback if accessToken is present
      if (accessToken) {
        try {
          const response = await axiosInstance.get("/user/profile/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          userData = response.data.data.user;
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", accessToken);
          // Clear the accessToken from the URL
          window.history.replaceState({}, document.title, "/");
        } catch (err) {
          console.error("Error fetching user from Google login:", err);
        }
      }
      // Handle stored user from localStorage
      else if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const response = await getUserById(parsedUser.id);
          userData = response;
        } catch (err) {
          console.error("Error fetching user from localStorage:", err);
          localStorage.removeItem("user"); // Clean up invalid user data
          localStorage.removeItem("token");
        }
      }

      if (userData) {
        setUser(userData);
      } else {
        setUser(null); // Ensure user is null if no valid data
      }
    };

    fetchUser();
  }, [location.search]);

  useEffect(() => {
    if (isLoggedIn && !isFetched) {
      const timeoutId = setTimeout(() => {
        dispatch(fetchCart()).catch((error) => {
          console.warn("Failed to fetch cart in header:", error);
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [dispatch]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full bg-[#eaf7e6] shadow-sm">
      <div className="w-full bg-gradient-to-r from-green-800 to-green-500 text-white text-center text-sm py-1 px-4 flex justify-between items-center">
        <div className="w-full text-center">
          {user ? (
            <span>Welcome back, {user.email || "valued customer"}!</span>
          ) : (
            <>
              Sign up and get your first order.{" "}
              <Link to="/signup" className="underline font-semibold">
                Sign Up Now
              </Link>
            </>
          )}
        </div>
        <button className="text-white font-bold pr-4 hidden sm:block">×</button>
      </div>

      <div className="w-full flex items-center justify-between px-60 py-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-green-700 text-2xl font-semibold">
            GreenBridge
          </Link>

          <Link to="/chatbot" className="flex items-center gap-2 relative ml-4">
            <div className="relative w-9 h-9">
              <svg
                className="w-9 h-9"
                viewBox="0 0 48 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28.5253 33.3787L26.1255 37.8932C25.2029 39.6286 22.2794 39.6286 21.3567 37.8932L18.9569 33.3787C16.8208 29.361 12.9768 26.1625 8.18151 24.4148L1.57527 22.0067C-0.525089 21.241 -0.525089 18.7318 1.57527 17.9661L7.97448 15.6327C12.893 13.8397 16.8064 10.523 18.9054 6.36833L21.3367 1.55679C22.2386 -0.228567 25.2423 -0.228567 26.1449 1.55679L28.5762 6.36833C30.6751 10.523 34.5886 13.8397 39.5071 15.6327L45.907 17.9661C48.0073 18.7318 48.0073 21.241 45.907 22.0067L39.3008 24.4154C34.5047 26.1625 30.6608 29.361 28.5253 33.3787Z"
                  fill="url(#gradLarge)"
                />
                <defs>
                  <radialGradient
                    id="gradLarge"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(37.1758 21.8621) rotate(76.5154) scale(30.7205 36.759)"
                  >
                    <stop stopColor="#57C413" />
                    <stop offset="0.3002" stopColor="#23A657" />
                    <stop offset="0.5455" stopColor="#39D096" />
                    <stop offset="1" stopColor="#D96570" />
                  </radialGradient>
                </defs>
              </svg>

              {/* SVG nhỏ nằm dưới bên phải */}
              <svg
                className="absolute -bottom-2 -right-4 w-6 h-6"
                viewBox="0 0 48 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28.5253 33.3787L26.1255 37.8932C25.2029 39.6286 22.2794 39.6286 21.3567 37.8932L18.9569 33.3787C16.8208 29.361 12.9768 26.1625 8.18151 24.4148L1.57527 22.0067C-0.525089 21.241 -0.525089 18.7318 1.57527 17.9661L7.97448 15.6327C12.893 13.8397 16.8064 10.523 18.9054 6.36833L21.3367 1.55679C22.2386 -0.228567 25.2423 -0.228567 26.1449 1.55679L28.5762 6.36833C30.6751 10.523 34.5886 13.8397 39.5071 15.6327L45.907 17.9661C48.0073 18.7318 48.0073 21.241 45.907 22.0067L39.3008 24.4154C34.5047 26.1625 30.6608 29.361 28.5253 33.3787Z"
                  fill="url(#gradSmall)"
                />
                <defs>
                  <radialGradient
                    id="gradSmall"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(37.1758 21.8621) rotate(76.5154) scale(30.7205 36.759)"
                  >
                    <stop offset="0%" stopColor="#1BA1E3" />
                    <stop offset="30%" stopColor="#5489D6" />
                    <stop offset="55%" stopColor="#9B72CB" />
                    <stop offset="83%" stopColor="#D96570" />
                    <stop offset="100%" stopColor="#F49C46" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* Chatbot text */}
            <span className="text-black font-medium ml-4">Chatbot</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`px-3 py-1 rounded-full font-medium ${
              isActive("/")
                ? "bg-green-500 text-white"
                : "text-black hover:text-green-600"
            }`}
          >
            Home
          </Link>
          <Link
            to="/viewall"
            className={`px-3 py-1 rounded-full font-medium ${
              isActive("/sell")
                ? "bg-green-500 text-white"
                : "text-black hover:text-green-600"
            }`}
          >
            Products
          </Link>
          <Link
            to="/about"
            className={`px-3 py-1 rounded-full font-medium ${
              isActive("/about")
                ? "bg-green-500 text-white"
                : "text-black hover:text-green-600"
            }`}
          >
            About us
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="rounded-full py-2 px-4 bg-[#f7f7f7] border border-gray-200 focus:outline-none w-48 sm:w-64"
            />
            <span className="absolute right-4 top-2.5 text-gray-400">
              <FaSearch />
            </span>
          </div>

          <div className="relative">
            {user ? (
              <div
                className="relative cursor-pointer group"
                onMouseEnter={() => setIsMenu(true)}
                onMouseLeave={() => setIsMenu(false)}
              >
                <div className="w-12 h-12 rounded-full shadow-md overflow-hidden flex items-center justify-center bg-white">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-xl text-green-700" />
                  )}
                </div>
                {isMenu && (
                  <div className="absolute top-12 left-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 px-5 py-4 space-y-3 transition-all duration-300">
                    <Link
                      to="/profile"
                      className="block text-base text-gray-700 hover:text-green-600 transition"
                    >
                      My Profile
                    </Link>

                    <hr />

                    {user.role === "admin" && (
                      <>
                        <Link
                          to="/admin"
                          className="block text-base text-gray-700 hover:text-green-600 transition"
                        >
                          Dashboard
                        </Link>
                        <hr />
                      </>
                    )}
                    {user.role === "gardener" && (
                      <>
                        <Link
                          to="/gardener/manage-plant"
                          className="block text-base text-gray-700 hover:text-green-600 transition"
                        >
                          Manage Plant
                        </Link>
                        <hr />
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800 hover:text-green-700 transition cursor-pointer"
                    >
                      <MdLogout className="text-xl" />
                      <span className="text-base">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login">
                <button className="cursor-pointer px-4 py-2 rounded-md shadow-md bg-white border border-green-400 text-green-600 hover:bg-green-50 transition">
                  Login
                </button>
              </NavLink>
            )}
          </div>

          <Link
            to="/cart"
            className="relative text-black text-2xl hover:text-green-600 transition"
          >
            <FaShoppingCart />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalItemsCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
