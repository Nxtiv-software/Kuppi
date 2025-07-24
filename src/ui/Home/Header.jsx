
import { Menu, X } from 'lucide-react';
import React from 'react';
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Header = () => {
  const dashboardPath = '/dashboard';

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <nav
        className="flex items-center justify-between px-8 py-4 backdrop-blur-md rounded-xl border border-white/30"
        style={{
          boxShadow: '0 0 20px rgba(64, 139, 219, 0.4)',
        }}
      >
        {/* Logo */}
        <div className="text-3xl font-bold text-blue-500">
          Kuppi.LK
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <li className="hover:text-blue-500 cursor-pointer">Home</li>
          <li className="hover:text-blue-500 cursor-pointer">Popular Sessions</li>
          <li className="hover:text-blue-500 cursor-pointer">About Us</li>
          <li className="hover:text-blue-500 cursor-pointer">Contact Us</li>
        </ul>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 text-sm">
          <button className="hover:text-blue-500">En 🌐</button>
          {/* <button className="hover:text-blue-500">Log in</button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium">
            Sign Up
          </button> */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "3rem",
                    height: "3rem",
                  },
                },
              }}
            />
            <Link to={dashboardPath}>
              <button className="px-4 py-1.5 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                Dashboard
              </button>
            </Link>
          </SignedIn>
          <SignedOut>
            <div className={`flex`}>
              <button>
                <Link to={"/login"}>Login</Link>
              </button>
              <button>
                <Link to={"/signup"}>Sign up</Link>
              </button>
            </div>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

//THis is the nav bar

export default Header;
