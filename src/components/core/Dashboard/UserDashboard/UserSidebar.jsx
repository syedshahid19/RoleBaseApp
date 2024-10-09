import React from "react";
import { NavLink, useNavigate } from "react-router-dom";


const UserSidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    // Clear token and role from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    
    // Redirect to login page
    navigate("/login");
  };
  return (
    <div className="h-screen w-60 bg-richblue-500 text-white p-4 fixed left-0 top-0">
      <h2 className="text-2xl font-bold mb-8">User Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <NavLink
            to="/user-dashboard"
            className="block py-2 px-4 hover:bg-richblue-400 rounded"
            activeClassName="bg-richblue-700"
          >
            Manual Lead Entry
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user-dashboard/Transaction-history"
            className="block py-2 px-4 hover:bg-richblue-400 rounded"
            activeClassName="bg-richblue-700"
          >
            Transaction-history
          </NavLink>
        </li>
        <button onClick={handleLogout}>Logout</button>
      </ul>
    </div>
  );
};

export default UserSidebar;
