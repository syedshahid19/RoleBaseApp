import React, { useState, useEffect } from 'react';
import axios from "axios";
// import { useVendors } from '../../../../utils/vendorContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const MonitorCommission = () => {
  // const { vendors } = useVendors();
  const [vendors, setVendors] = useState([]);
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve auth token

        // Fetch Vendors
        const vendorsResponse = await axios.get(`${BASE_URL}/vendor/getAllVendors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVendors(vendorsResponse.data.vendors); // Assuming your API returns vendors array
        console.log("get vendors from vendor routes", vendorsResponse.data.vendors);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    //  // Polling every 10 seconds
    //  const intervalId = setInterval(fetchData, 3000);

    //  // Cleanup on unmount
    //  return () => clearInterval(intervalId);
  }, [setVendors]);

  const filteredVendor = vendors.filter(vendor => vendor.userId._id === userId)[0];

  if (loading) {
    return <div>Loading leads and vendors...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center lg:mx-0 md:mx-0 sm:mx-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Commission Monitor</h1>
      {filteredVendor ? (
        <div 
          key={filteredVendor._id} 
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-lg p-8 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl min-w-[350px] w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold mb-2 truncate">{filteredVendor.userId.firstName}</h2>
          <div className="space-y-3">
            <p className="flex justify-between text-xl mt-4">
              <span className="font-medium">Service:</span>
              <span className="text-right">{filteredVendor.service}</span>
            </p>
            <p className="flex justify-between text-xl mt-4">
              <span className="font-medium">Leads Converted:</span>
              <span className="text-right">{filteredVendor.leadsConverted}</span>
            </p>
            <p className="flex justify-between text-xl mt-4">
              <span className="font-medium">Commission Rate:</span>
              <span className="text-right">{filteredVendor.commissionRates[filteredVendor.service]}%</span>
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No vendor data available.</p>
      )}
    </div>
  );
};

export default MonitorCommission;
