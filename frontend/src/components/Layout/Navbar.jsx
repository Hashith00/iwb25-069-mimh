import React from 'react';
import { Menu, X, Leaf } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="bg-eco-green shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-white hover:bg-eco-dark focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <Leaf className="h-8 w-8 text-white mr-2" />
              <span className="text-white text-xl font-bold">Green Proxy</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-white text-sm">
              Carbon-Aware Load Balancing
            </div>
            <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
              <span className="text-white text-xs font-medium">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
