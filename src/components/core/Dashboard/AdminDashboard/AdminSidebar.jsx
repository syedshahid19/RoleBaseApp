import React from "react";
import CommonSidebar from "../CommonSidebar";
import { FaHome, FaMoneyBillWave, FaChartBar, FaFileUpload } from "react-icons/fa";


const AdminSidebar = () => {
  const adminLinks = [
    { path: "/admin-dashboard", label: "Home - All Leads", icon: <FaHome /> },
    { path: "/admin-dashboard/commission", label: "Commission", icon: <FaMoneyBillWave /> },
    { path: "/admin-dashboard/bulk-upload", label: "Bulk Upload", icon: <FaFileUpload /> },
  ];

  return (
    <div className="">
      <CommonSidebar links={adminLinks} />
    </div>
  );
};

export default AdminSidebar;
