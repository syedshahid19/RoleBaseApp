import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Commission = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [serviceType, setServiceType] = useState("Forex");
  const [commissionRate, setCommissionRate] = useState("");
  const [commissionRates, setCommissionRates] = useState({});
  const [allCommissionData, setAllCommissionData] = useState([]);
  const [selectedVendorName, setSelectedVendorName] = useState("");
  
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const vendorsResponse = await axios.get(`${BASE_URL}/admin/getVendors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVendors(vendorsResponse.data.vendors || []);
        fetchAllVendorsCommission();
      } catch (error) {
        console.error("Error fetching vendors:", error.message);
      }
    };

    fetchVendors();
  }, [token]);

  useEffect(() => {
    if (selectedVendorId) {
      getCommissionRates();
    }
  }, [selectedVendorId]);

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
    } catch (error) {
      console.error("Error fetching all vendors' commission rates:", error.message);
    }
  };

  const handleSetCommission = async (e) => {
    e.preventDefault();
    if (!selectedVendorId) {
      alert("Please select a vendor");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/admin/set-commission`,
        { vendorId: selectedVendorId, serviceType, commissionRate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getCommissionRates();
      setCommissionRate(""); // Clear the input after setting
    } catch (error) {
      console.error("Error setting commission rate:", error.message);
    }
  };

  const handleVendorChange = (e) => {
    const vendorId = e.target.value;
    setSelectedVendorId(vendorId);
    const selectedVendor = vendors.find(vendor => vendor._id === vendorId);
    setSelectedVendorName(selectedVendor ? selectedVendor.userId.firstName : "");
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
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="Investment-Advice">Investment Advice</option>
            <option value="Wealth-Management">Wealth Management</option>
            <option value="Financial-Planning">Financial Planning</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block">Commission Rate (%)</label>
          <input
            type="number"
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter Commission Rate"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Set Commission
        </button>
      </form>

      {/* Display current commission rates */}
      <h2 className="text-richblack-500 text-2xl"> current commission rates</h2>
      {Object.keys(commissionRates).length > 0 ? (
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Vendor Name</th>
              <th className="py-2 px-4 border-b">Service Type</th>
              <th className="py-2 px-4 border-b">Commission Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(commissionRates).map(([service, rate], index) => (
              <tr key={`${service}-${selectedVendorId}-${index}`} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{selectedVendorName}</td>
                <td className="border px-4 py-2">{service}</td>
                <td className="border px-4 py-2">{rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No commission rates available for this vendor.</p>
      )}

      <h2 className="text-richblack-500 text-2xl">All Vendor Commission Rates</h2>
      {allCommissionData.length > 0 ? (
        <table className="min-w-full bg-white border rounded-lg shadow mt-6">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Vendor Name</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Service Type</th>
              <th className="py-2 px-4 border-b">Commission Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {allCommissionData.map((commission, index) => (
              <tr key={`${commission.vendorName}-${index}`} className="hover:bg-gray-100">
                <td className="border px-4 py-2" rowSpan={commission.commissionRates.length}>
                  {commission.vendorName || "N/A"}
                </td>
                <td className="border px-4 py-2" rowSpan={commission.commissionRates.length}>
                  {commission.location || "N/A"}
                </td>
                {commission.commissionRates.map((rate, i) => (
                  <React.Fragment key={`${rate[0]}-${i}`}>
                    {i === 0 ? null : <tr />}
                    <td className="border px-4 py-2">{rate[0]}</td>
                    <td className="border px-4 py-2">{rate[1]}</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No commission rates available for all vendors.</p>
      )}
    </div>
  );
};

export default Commission;
