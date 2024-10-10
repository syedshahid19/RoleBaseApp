import React from "react";
import CommonSidebar from "../CommonSidebar";
import { FaFileUpload, FaHistory } from "react-icons/fa";


const UserSidebar = () => {

  const userLinks = [
    { path: "/user-dashboard", label: "Manual Lead Entry", icon: <FaFileUpload /> },
    { path: "/user-dashboard/transaction-history", label: "Transaction History", icon: <FaHistory /> },
  ];

  return (
    <div className="flex">
      <CommonSidebar links={userLinks} />
    </div>
  );
};

export default UserSidebar;
