
import { Menu, X } from 'lucide-react';
import React from 'react';
import { Link } from "react-router-dom";

import styled from 'styled-components';

const LoginButton = styled.button`
  background-color: #2563EB;
  color: white;
  padding: 0.85rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
`;


const SignUpButton = styled.button`
border: 1px solid;
  border-color: #2563EB;
  color: #000000;
  padding: 0.85rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const Header = () => {
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
          <li className="hover:text-blue-500 cursor-pointer">
            <Link to={"/"}>Home </Link>
          </li>
          <li className="hover:text-blue-500 cursor-pointer">
            <Link to={"/session"}>Popular Sessions</Link>
          </li>
          <li className="hover:text-blue-500 cursor-pointer">
            <Link to={"/about"}>About Us</Link>
          </li>
          <li className="hover:text-blue-500 cursor-pointer">
            <Link to={"/contact"}>Contact Us</Link>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 text-sm">
          <button className="hover:text-blue-500">En 🌐</button>
          {/* <button className="hover:text-blue-500">Log in</button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium">
            Sign Up
          </button> */}
          
            {/* <Link to={dashboardPath}>
              <button className="px-4 py-1.5 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                Dashboard
              </button>
            </Link> */}
          
          
            <div className={`flex gap-5`}>
              <LoginButton>
                <Link to={"/login"}>Login</Link>
              </LoginButton>
              
              <SignUpButton>
                <Link to={"/signup"}>Sign up</Link>
              </SignUpButton>
            </div>
          
        </div>
      </nav>
    </header>
  );
};

//THis is the nav bar

export default Header;
