import React from 'react';
import { useVendors } from '../../../../utils/vendorContext';

const MonitorCommission = () => {
  const { vendors } = useVendors();

  // Get the userId from local storage
  const userId = localStorage.getItem("userId");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {vendors
        .filter(vendor => vendor.userId._id === userId) // Filter by user ID
        .map((vendor) => {
          // Access the commission rate for the specific service
          const commissionRate = vendor.commissionRates[vendor.service];

          return (
            <div key={vendor._id} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold">{vendor.userId.firstName}</h2>
              <p className="text-gray-600">Service: {vendor.service}</p>
              <p className="text-gray-600">Leads Converted: {vendor.leadsConverted}</p>
              <p className="text-gray-600">Commission Rate: {commissionRate} %</p> {/* Display commission rate */}
            </div>
          );
        })}
    </div>
  );
};

export default MonitorCommission;
