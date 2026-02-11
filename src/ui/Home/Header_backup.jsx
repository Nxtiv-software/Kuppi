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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <img className="h-12 w-auto object-contain" src={logo} alt="logo" />

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
            <li className="hover:text-blue-600 cursor-pointer transition-colors">
              <Link to="/">{t("nav.home")}</Link>
            </li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">
              <Link to="/session">{t("nav.popular")}</Link>
            </li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">
              <Link to="/about">{t("nav.about")}</Link>
            </li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">
              <Link to="/contact">{t("nav.contact")}</Link>
            </li>
          </ul>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 text-sm">
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="hover:text-blue-600 flex items-center gap-1 select-none transition-colors"
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
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-md ${
                      i18n.language === "en" ? "font-semibold bg-blue-50" : ""
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("si")}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-md ${
                      i18n.language === "si" ? "font-semibold bg-blue-50" : ""
                    }`}
                  >
                    සිංහල
                  </button>
                </div>
              )}
            </div>

            {/* Login & Sign Up */}
            <div className="flex gap-3">
              <SignedOut>
                <div className="flex gap-3">
                  <Link
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-2 text-white rounded-md transition-colors font-medium"
                    to="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="px-5 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
                    to="/signup"
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
                    <StudentDashBoardButton />
                  )}
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
