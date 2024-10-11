import React, { useState, useEffect } from "react";
import { useVendors } from "../../../../utils/vendorContext";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CommissionSettings = () => {
  const { vendors } = useVendors();
  const [threshold, setThreshold] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [commissionRateValue, setCommissionRateValue] = useState("");
  const [leadsConvertedCount, setLeadsConvertedCount] = useState("");
  const [commissionRates, setCommissionRates] = useState({});
  const [allCommissionData, setAllCommissionData] = useState([]);
  const [selectedVendorName, setSelectedVendorName] = useState("");
  const [serviceType, setServiceType] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const selectedVendor = vendors.find((vendor) => vendor._id === selectedVendorId);
    if (selectedVendor) {
      setServiceType(selectedVendor.service || "Forex");
      setLeadsConvertedCount(selectedVendor.leadsConverted || 0);
      setSelectedVendorName(selectedVendor.userId.firstName);
      getCommissionRates();
    }

    fetchAllVendorsCommission(); // Fetch all commissions on component mount

    // Set up polling to fetch all commissions every 30 seconds
    const intervalId = setInterval(fetchAllVendorsCommission, 3000); // Adjust time as needed

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, [selectedVendorId, vendors]);

  const getCommissionRates = async () => {
    if (!selectedVendorId) return;

    try {
      const response = await axios.get(`${BASE_URL}/admin/get-commission/${selectedVendorId}`);
      setCommissionRates(response.data.commissionRates || {});
    } catch (error) {
      console.error("Error fetching commission rates:", error.message);
    }
  };

  const fetchAllVendorsCommission = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/get-all-commissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCommissionData(response.data.vendorCommissionData || []);
      console.log("response.data.vendorCommissionData", response.data);
      
    } catch (error) {
      console.error("Error fetching all vendors' commission rates:", error.message);
    }
  };

  const calculateCommissionRate = (serviceType, leadsWon, threshold, commissionRate) => {
    return leadsWon >= threshold ? commissionRate : 0;
  };

  const handleSetCommission = async (e) => {
    e.preventDefault();
    if (!selectedVendorId) {
      alert("Please select a vendor");
      return;
    }

    const calculatedRate = calculateCommissionRate(serviceType, leadsConvertedCount, threshold, commissionRateValue);
    setCommissionRateValue(calculatedRate);

    try {
      // Send the commission data to the server
      await axios.post(
        `${BASE_URL}/admin/set-commission`,
        {
          vendorId: selectedVendorId,
          serviceType,
          commissionRate: calculatedRate,
          leadsConverted: leadsConvertedCount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the allCommissionData state to reflect the new commission rate
      setAllCommissionData((prevData) =>
        prevData.map((vendor) => {
          if (vendor.vendorName === selectedVendorName && vendor.service === serviceType) {
            // Update commissionRates for the current service
            const updatedCommissionRates = vendor.commissionRates.map((rate) => {
              if (rate[0] === serviceType) {
                return [serviceType, calculatedRate]; // Update the specific service rate
              }
              return rate; // Keep the rest of the rates unchanged
            });
            // Return the updated vendor data
            return {
              ...vendor,
              leadsConverted: leadsConvertedCount,
              commissionRates: updatedCommissionRates,
            };
          }
          return vendor; // Return unchanged vendors
        })
      );

      // Clear form inputs after submission
      setCommissionRateValue("");
      setLeadsConvertedCount(0);
      setThreshold("");
    } catch (error) {
      console.error("Error setting commission rate:", error.message);
    }
  };

  const handleVendorChange = (e) => {
    setSelectedVendorId(e.target.value);
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard - Set Commissions</h2>

      <form onSubmit={handleSetCommission} className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="mb-4">
          <label className="block">Select Vendor</label>
          <select
            value={selectedVendorId}
            onChange={handleVendorChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select a Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor._id} value={vendor._id}>
                {vendor.userId.firstName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Service Type</label>
          <span className="border p-2 w-full rounded bg-gray-100">{serviceType || "N/A"}</span>
        </div>

        <div className="mb-4">
          <label className="block">Threshold for Leads</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="border p-2 w-full rounded"
            placeholder="Enter Threshold for Leads"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block">Commission Rate</label>
          <input
            type="number"
            value={commissionRateValue}
            onChange={(e) => setCommissionRateValue(Number(e.target.value))}
            className="border p-2 w-full rounded"
            placeholder="Enter Commission Rate"
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Set Commission
        </button>
      </form>

      {/* Table to display all vendors' commission data */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">All Vendor Commissions</h3>
        <table className="min-w-full table-auto bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Vendor Name</th>
              <th className="px-4 py-2">Service Type</th>
              <th className="px-4 py-2">Leads Converted</th>
              <th className="px-4 py-2">Commission Rate</th>
            </tr>
          </thead>
          <tbody>
            {allCommissionData.map((vendor) => {
              // Log the vendor's commission rates to see if they're coming in correctly
              console.log("Vendor Commission Rates: ", vendor.commissionRates);

              // Find the commission rate for the current service
              const commissionRateEntry = vendor.commissionRates?.find(
                (rate) => rate[0] === vendor.service
              );
              const commissionRate = commissionRateEntry ? commissionRateEntry[1] : "N/A";

              return (
                <tr key={vendor.vendorName} className="border-t">
                  <td className="px-4 py-2">{vendor.vendorName}</td>
                  <td className="px-4 py-2">{vendor.service}</td>
                  <td className="px-4 py-2">{vendor.leadsConverted || "N/A"}</td>
                  <td className="px-4 py-2">{commissionRate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommissionSettings;
