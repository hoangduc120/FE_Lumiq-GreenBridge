import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { isActiveStyles, isNotActiveStyles } from "../utils/styles.utils";
import { IoMoonOutline } from "react-icons/io5";
import { MdOutlineLightMode } from "react-icons/md";
import { Logo } from "../assets";
const GardenerSidebar = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setIsDarkTheme(theme === "dark");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  const navItems = [{ label: "Manage Plant", path: "/gardener/manage-plant" }, { label: "Add Plant", path: "/gardener/add-plant" }];

  const handleMouseEnter = () => {
    if (!isAnimating) {
      setIsAnimating(true);
    }
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <div className="h-full py-12 flex flex-col bg-lightOverlay dark:bg-darkBg min-w-[210px] w-[300px] gap-3 transition-colors duration-500 ease-in-out shadow-md">
      <NavLink to={"/"} className="flex items-center justify-start px-6 gap-4">
        <img src={Logo} className="w-2/3" alt="" />
      </NavLink>
      <hr className="dark:border-darkOverlay-300 transition-colors duration-500 ease-in-out" />
      <ul className="flex flex-col gap-4 px-6">
        {navItems.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive
                ? `${isActiveStyles} px-4 py-2 border-l-8 border-green-500`
                : `${isNotActiveStyles} px-4 py-2 dark:text-darkTextColor`
            }
          >
            {label}
          </NavLink>
        ))}
      </ul>
      <div className="mt-auto px-6 pt-4">
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <button onClick={toggleTheme}>
            {isDarkTheme ? <IoMoonOutline /> : <MdOutlineLightMode />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GardenerSidebar;
