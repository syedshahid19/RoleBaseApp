import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const CommonSidebar = ({ links }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed top-4 left-4 z-20 bg-richblue-500 text-white p-2 rounded-md transition-all duration-300 ease-in-out hover:bg-richblue-600"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        bg-richblue-500 text-white fixed top-0 left-0 h-full z-40
        w-64 shadow-lg rounded-r-xl overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4">
          <p className="text-2xl font-bold">Dashboard</p>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-white focus:outline-none hover:text-gray-300"
            aria-label="Close menu"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <nav>
          <ul className="space-y-2 mt-4 px-4">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `
                    flex items-center py-3 px-4 rounded transition-colors duration-300
                    hover:bg-richblue-400
                    ${isActive ? 'bg-richblue-600' : ''}
                  `}
                  end
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon && <span className="text-xl mr-3">{link.icon}</span>}
                  <span className="text-lg">{link.label}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full py-3 px-4 rounded transition-colors duration-300 hover:bg-red-500"
              >
                <FaSignOutAlt className="text-xl mr-3" />
                <span className="text-lg">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default CommonSidebar;