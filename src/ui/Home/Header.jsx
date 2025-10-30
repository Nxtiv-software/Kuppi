import { Menu, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import logo from "../../assets/images/logo.png";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/clerk-react";
import LoginClerk from "../LoginClerk";
import StudentDashboard from "../../features/students-dashboard/StudentDasboard";
import StudentDashBoardButton from "../../features/students-dashboard/StudentDashBoardButton";
import TuttorDashBoardButton from "../../features/tutor-dashboard/TuttorDashBoardButton";
import AdminDashBoardButton from "../../features/admin-dashboard/AdminDashBoardButton";
import { useUserRole, USER_ROLES } from "../../utils/roleUtils";

const LoginButton = styled.button`
  border: 1px solid;
  border-color: #2563eb;
  color: #000000;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const SignUpButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const Header = () => {
  const { t, i18n } = useTranslation("global");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isLoaded, user } = useUser();

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setDropdownOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isLoaded) return <div>Loading...</div>;
  
  // Use our role utility to get user role
  const { role } = useUserRole();
  console.log('User role:', role);

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <nav
        className="flex items-center justify-between px-8 py-3 backdrop-blur-md rounded-xl border border-white/30"
        style={{ boxShadow: "0 0 20px rgba(64, 139, 219, 0.4)" }}
      >
        {/* Logo */}
        {/* <div className="text-3xl font-bold text-blue-500">{logo}</div> */}
        <img className="h-15 w-auto object-contain" src={logo} alt="logo" />

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <li className="hover:text-blue-500 cursor-pointer">
            <Link to="/">{t("nav.home")}</Link>
          </li>
          <li className="hover:text-blue-500 cursor-pointer">
            <Link to="/session">{t("nav.popular")}</Link>
          </li>
          <li className="hover:text-blue-500 cursor-pointer">
            <Link to="/about">{t("nav.about")}</Link>
          </li>
          <li className="hover:text-blue-500 cursor-pointer">
            <Link to="/contact">{t("nav.contact")}</Link>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 text-sm relative">
          {/* Language Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="hover:text-blue-500 flex items-center gap-1 select-none"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              {t("language")}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    i18n.language === "en" ? "font-semibold bg-gray-200" : ""
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage("si")}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    i18n.language === "si" ? "font-semibold bg-gray-200" : ""
                  }`}
                >
                  සිංහල
                </button>
              </div>
            )}
          </div>

          {/* Login & Sign Up */}
          <div className="flex gap-2">
            {/* <LoginButton>
              <Link to="/login">{t('auth.login')}</Link>
            </LoginButton>

            <SignUpButton>
              <Link to="/signup">{t('auth.signup')}</Link>
            </SignUpButton> */}

            <SignedOut>
              <div className={`flex gap-2`}>
                <Link
                  className="bg-blue-600 px-4 py-3 text-white rounded-md"
                  to={"/login"}
                >
                  Login
                </Link>
                <Link
                  className="px-4 py-3 border-2 border-blue-500 rounded-md"
                  to={"/signup"}
                >
                  Sign up
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-3">
                {role === USER_ROLES.STUDENT ? (
                  <StudentDashBoardButton />
                ) : role === USER_ROLES.TUTOR ? (
                  <TuttorDashBoardButton />
                ) : role === USER_ROLES.ADMIN ? (
                  <AdminDashBoardButton />
                ) : (
                  // Default to student dashboard if role is not determined
                  <StudentDashBoardButton />
                )}
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
