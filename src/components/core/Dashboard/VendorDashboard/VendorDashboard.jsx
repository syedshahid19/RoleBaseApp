import React from "react";
import VendorSidebar from "./VendorSidebar";
import { Outlet } from "react-router-dom";

const VendorDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <VendorSidebar />

      {/* Main Content */}
      <div className=" p-8 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorDashboard;
