import React from "react";
import CommonSidebar from "../CommonSidebar";
import { FaHome, FaChartPie, FaMoneyBillWave } from "react-icons/fa";


const VendorSidebar = () => {
    const vendorLinks = [
        { path: "/vendor-dashboard", label: "Vendor Home", icon: <FaHome /> },
        { path: "/vendor-dashboard/vendors-creation", label: "Vendors Creation", icon: <FaChartPie /> },
        { path: "/vendor-dashboard/monitor-commission", label: "Monitor Commission", icon: <FaMoneyBillWave /> },
    ];
    
      return (
        <div className="flex">
          <CommonSidebar links={vendorLinks} />
        </div>
      );
};

export default VendorSidebar;
