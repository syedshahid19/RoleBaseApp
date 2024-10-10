// CommonSidebar.js
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; // Import icons

const CommonSidebar = ({ links }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); // State to manage sidebar visibility

  const handleLogout = () => {
    // Clear token and role from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className={`bg-richblue-500 text-white p-4 fixed top-0 left-0 h-screen transition-transform duration-300 ${isOpen ? 'w-60' : 'w-16'} shadow-lg rounded-r-xl`}>
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold mb-8 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          Dashboard
        </h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {/* Icon for toggling sidebar */}
          <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <svg width="20" height="20" fill="currentColor">
              <path d="M10 15l-5-5h10l-5 5z" />
            </svg>
          </span>
        </button>
      </div>
      <ul className="space-y-4 mt-4">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={`flex items-center py-3 px-4 rounded transition-colors duration-300 hover:bg-richblue-400 ${isOpen ? 'justify-start' : 'justify-center'}`}
              activeClassName="bg-richblue-700"
            >
              {/* Icon rendering based on the path */}
              {link.icon && <span className="text-xl">{link.icon}</span>} {/* Increased icon size */}
              {isOpen && <span className="ml-2 text-lg">{link.label}</span>} {/* Increased label font size */}
            </NavLink>
          </li>
        ))}
        <li>
          <button onClick={handleLogout} className="flex items-center py-3 px-4 rounded transition-colors duration-300 hover:bg-red-500 justify-start">
            <FaSignOutAlt className="mr-2 text-xl" /> {/* Logout icon with increased size */}
            {isOpen && <span className="text-lg">Logout</span>} {/* Increased label font size */}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default CommonSidebar;
