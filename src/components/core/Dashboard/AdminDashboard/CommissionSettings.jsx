import React, { useState, useEffect } from "react";
import { useVendors } from "../../../../utils/vendorContext";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CommissionSettings = () => {
  const { vendors } = useVendors();
  const [formData, setFormData] = useState({
    threshold: "",
    selectedVendorId: "",
    commissionRateValue: "",
    leadsConvertedCount: "",
    selectedVendorName: "",
    serviceType: "",
  });

  const [allCommissionData, setAllCommissionData] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const selectedVendor = vendors.find((vendor) => vendor._id === formData.selectedVendorId);
    if (selectedVendor) {
      setFormData((prevData) => ({
        ...prevData,
        serviceType: selectedVendor.service || "Forex",
        leadsConvertedCount: selectedVendor.leadsConverted || 0,
        selectedVendorName: selectedVendor.userId.firstName,
      }));
    }

    fetchAllVendorsCommission(); // Fetch all commissions on component mount

    const intervalId = setInterval(fetchAllVendorsCommission, 3000); // Adjust time as needed

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, [formData.selectedVendorId, vendors]);

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

  const calculateCommissionRate = (serviceType, leadsWon, threshold, commissionRate) => {
    return leadsWon >= threshold ? commissionRate : 0;
  };

  const handleSetCommission = async (e) => {
    e.preventDefault();
    const { selectedVendorId, serviceType, threshold, commissionRateValue, leadsConvertedCount, selectedVendorName } = formData;

    if (!selectedVendorId) {
      toast.error("Please select a vendor");
      return;
    }

    const calculatedRate = calculateCommissionRate(serviceType, leadsConvertedCount, threshold, commissionRateValue);

    try {
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

      setAllCommissionData((prevData) =>
        prevData.map((vendor) => {
          if (vendor.vendorName === selectedVendorName && vendor.service === serviceType) {
            const updatedCommissionRates = vendor.commissionRates.map((rate) => {
              if (rate[0] === serviceType) {
                return [serviceType, calculatedRate];
              }
              return rate;
            });
            return {
              ...vendor,
              leadsConverted: leadsConvertedCount,
              commissionRates: updatedCommissionRates,
            };
          }
          return vendor;
        })
      );

      setFormData({
        threshold: "",
        selectedVendorId: "",
        commissionRateValue: "",
        leadsConvertedCount: "",
        selectedVendorName: "",
        serviceType: "",
      });
    } catch (error) {
      console.error("Error setting commission rate:", error.message);
    }
  };

  const handleVendorChange = (e) => {
    setFormData({
      ...formData,
      selectedVendorId: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 w-8/12">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Set Commissions</h2>

      {/* Form */}
      <form onSubmit={handleSetCommission} className="mb-6 bg-white p-4 rounded-lg shadow-md grid gap-6 lg:grid-cols-2">
        <div className="mb-4">
          <label className="block">Select Vendor</label>
          <select
            value={formData.selectedVendorId}
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
          <span className="border p-2 w-full rounded bg-gray-100">{formData.serviceType || "N/A"}</span>
        </div>

        <div className="mb-4">
          <label className="block">Threshold for Leads</label>
          <input
            type="number"
            value={formData.threshold}
            onChange={(e) => setFormData({ ...formData, threshold: Number(e.target.value) })}
            className="border p-2 w-full rounded"
            placeholder="Enter Threshold for Leads"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block">Commission Rate</label>
          <input
            type="number"
            value={formData.commissionRateValue}
            onChange={(e) => setFormData({ ...formData, commissionRateValue: Number(e.target.value) })}
            className="border p-2 w-full rounded"
            placeholder="Enter Commission Rate"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded col-span-full lg:col-span-2 hover:bg-richblue-700 transition-all duration-300 ease-in"
        >
          Set Commission
        </button>
      </form>

      {/* Responsive Table */}
      <div className="mt-8 scroll-container">
        <h3 className="text-xl font-semibold mb-4 text-white">All Vendor Commissions</h3>
        <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-richblue-100">
              <th className="px-4 py-2">Vendor Name</th>
              <th className="px-4 py-2">Service Type</th>
              <th className="px-4 py-2">Leads Converted</th>
              <th className="px-4 py-2">Commission Rate</th>
            </tr>
          </thead>
          <tbody>
            {allCommissionData.map((vendor) => {
              const commissionRateEntry = vendor.commissionRates?.find(
                (rate) => rate[0] === vendor.service
              );
              const commissionRate = commissionRateEntry ? commissionRateEntry[1] : 0;

              return (
                <tr key={vendor.vendorName} className="border-t">
                  <td className="px-4 py-2">{vendor.vendorName}</td>
                  <td className="px-4 py-2">{vendor.service}</td>
                  <td className="px-4 py-2">{vendor.leadsConverted || 0}</td>
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
