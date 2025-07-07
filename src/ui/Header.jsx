import { useState } from 'react';
import { Button } from '../components/Button';
import { Menu, X } from 'lucide-react';
import React from 'react';

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
          <li className="hover:text-blue-500 cursor-pointer">me</li>
          <li className="hover:text-blue-500 cursor-pointer">Popular Sessions</li>
          <li className="hover:text-blue-500 cursor-pointer">About Us</li>
          <li className="hover:text-blue-500 cursor-pointer">Contact Us</li>
        </ul>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 text-sm">
          <button className="hover:text-blue-500">En 🌐</button>
          <button className="hover:text-blue-500">Log in</button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium">
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
