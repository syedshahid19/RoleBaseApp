import React from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className=" p-8 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
