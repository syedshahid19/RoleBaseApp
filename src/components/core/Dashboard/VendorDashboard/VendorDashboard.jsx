import React from "react";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and role from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div>
      <h1>Vendor Dashboard</h1>
      <button onClick={handleLogout} className="mt-4 bg-red-600 text-white py-2 px-4 rounded">
        Logout
      </button>
    </div>
  );
};

export default VendorDashboard;

