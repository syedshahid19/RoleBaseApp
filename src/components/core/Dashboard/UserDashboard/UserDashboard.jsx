import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";

const UserDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <UserSidebar />
      
      {/* Main Content */}
      <div className=" p-8 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};


export default UserDashboard;

