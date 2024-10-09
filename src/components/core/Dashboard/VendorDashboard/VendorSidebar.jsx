import React from "react";
import { NavLink, useNavigate } from "react-router-dom";


const VendorSidebar = () => {

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
      <h2 className="text-2xl font-bold mb-8">Vendor Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <NavLink
            to="/vendor-dashboard"
            className="block py-2 px-4 hover:bg-richblue-400 rounded"
            activeClassName="bg-richblue-700"
          >
            Home - Leads Assigned
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/vendor-dashboard/vendors-creation"
            className="block py-2 px-4 hover:bg-richblue-400 rounded"
            activeClassName="bg-richblue-700"
          >
            Create Vendor
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/vendor-dashboard/Tracking-Performance"
            className="block py-2 px-4 hover:bg-richblue-400 rounded"
            activeClassName="bg-richblue-700"
          >
            Tracking Performance
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/vendor-dashboard/monitor-commission"
            className="block py-2 px-4 hover:bg-richblue-400 rounded"
            activeClassName="bg-richblue-700"
          >
            Monitor Commission
          </NavLink>
        </li>
        <button onClick={handleLogout}>Logout</button>
      </ul>
    </div>
  );
};

export default VendorSidebar;
