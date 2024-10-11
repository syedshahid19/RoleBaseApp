import React from "react";
import CommonSidebar from "../CommonSidebar";
import { FaFileUpload, FaHistory } from "react-icons/fa";


const UserSidebar = () => {

  const userLinks = [
    { path: "/user-dashboard", label: "Manual Lead Entry", icon: <FaFileUpload /> },
  ];

  return (
    <div className="flex">
      <CommonSidebar links={userLinks} />
    </div>
  );
};

export default UserSidebar;
